import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types'
import Connection from '../models/Connection'
import Contact from '../models/Contact'
import NetworkingActivity from '../models/NetworkingActivity'
import User from '../models/User'
import { AppError } from '../middleware/errorHandler'

// Connection Management
export const sendConnectionRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest
    const { recipientId, note, source = 'profile' } = req.body
    const requesterId = authReq.user._id

    if (recipientId === requesterId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      })
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    })

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection already exists or pending'
      })
    }

    // Calculate mutual connections
    const requesterConnections = await Connection.find({
      $or: [
        { requester: requesterId, status: 'accepted' },
        { recipient: requesterId, status: 'accepted' }
      ]
    }).select('requester recipient')

    const recipientConnections = await Connection.find({
      $or: [
        { requester: recipientId, status: 'accepted' },
        { recipient: recipientId, status: 'accepted' }
      ]
    }).select('requester recipient')

    const requesterConnectionIds = new Set()
    requesterConnections.forEach(conn => {
      requesterConnectionIds.add(conn.requester.toString())
      requesterConnectionIds.add(conn.recipient.toString())
    })

    let mutualCount = 0
    recipientConnections.forEach(conn => {
      const otherId = conn.requester.toString() === recipientId ? conn.recipient.toString() : conn.requester.toString()
      if (requesterConnectionIds.has(otherId)) {
        mutualCount++
      }
    })

    // Create connection request
    const connection = new Connection({
      requester: requesterId,
      recipient: recipientId,
      connectionNote: note,
      connectionSource: source,
      mutualConnections: mutualCount
    })

    await connection.save()

    // Log networking activity
    const activity = new NetworkingActivity({
      user: requesterId,
      activityType: 'connection_request',
      description: `Sent connection request to ${recipient.firstName} ${recipient.lastName}`,
      metadata: {
        subject: note
      }
    })
    await activity.save()

    await connection.populate('recipient', 'firstName lastName email profileImage company jobTitle')

    res.status(201).json({
      success: true,
      data: connection,
      message: 'Connection request sent successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const respondToConnectionRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { connectionId } = req.params
    const { status } = req.body // 'accepted' or 'declined'
    const userId = req.user._id

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "declined"'
      })
    }

    const connection = await Connection.findById(connectionId)
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      })
    }

    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this connection request'
      })
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Connection request already responded to'
      })
    }

    connection.status = status
    connection.respondedAt = new Date()
    await connection.save()

    // Update connection counts if accepted
    if (status === 'accepted') {
      await User.findByIdAndUpdate(connection.requester, { $inc: { connectionCount: 1 } })
      await User.findByIdAndUpdate(connection.recipient, { $inc: { connectionCount: 1 } })

      // Auto-create contacts for both users
      const [requester, recipient] = await Promise.all([
        User.findById(connection.requester),
        User.findById(connection.recipient)
      ])

      if (requester && recipient) {
        // Create contact for requester
        const requesterContact = new Contact({
          owner: requester._id,
          user: recipient._id,
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          email: recipient.email,
          company: recipient.company,
          jobTitle: recipient.jobTitle,
          bio: recipient.bio,
          profileImage: recipient.profileImage,
          socialLinks: recipient.socialLinks,
          relationship: 'colleague',
          contactSource: 'connection'
        })

        // Create contact for recipient
        const recipientContact = new Contact({
          owner: recipient._id,
          user: requester._id,
          firstName: requester.firstName,
          lastName: requester.lastName,
          email: requester.email,
          company: requester.company,
          jobTitle: requester.jobTitle,
          bio: requester.bio,
          profileImage: requester.profileImage,
          socialLinks: requester.socialLinks,
          relationship: 'colleague',
          contactSource: 'connection'
        })

        await Promise.all([requesterContact.save(), recipientContact.save()])
      }
    }

    // Log networking activity
    const activity = new NetworkingActivity({
      user: userId,
      activityType: 'connection_accepted',
      description: status === 'accepted' 
        ? `Accepted connection request from ${connection.requester}`
        : `Declined connection request from ${connection.requester}`
    })
    await activity.save()

    await connection.populate('requester', 'firstName lastName email profileImage company jobTitle')

    res.json({
      success: true,
      data: connection,
      message: `Connection request ${status} successfully`
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getConnections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { status = 'accepted', page = 1, limit = 20, search } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    let query: any = {
      $or: [
        { requester: userId },
        { recipient: userId }
      ],
      status
    }

    let connections = await Connection.find(query)
      .populate('requester', 'firstName lastName email profileImage company jobTitle')
      .populate('recipient', 'firstName lastName email profileImage company jobTitle')
      .sort({ respondedAt: -1, requestedAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Filter by search if provided
    if (search) {
      const searchTerm = (search as string).toLowerCase()
      connections = connections.filter(conn => {
        const otherUser = conn.requester._id.toString() === userId ? conn.recipient : conn.requester
        return otherUser.firstName.toLowerCase().includes(searchTerm) ||
               otherUser.lastName.toLowerCase().includes(searchTerm) ||
               (otherUser.company && otherUser.company.toLowerCase().includes(searchTerm))
      })
    }

    const total = await Connection.countDocuments(query)

    res.json({
      success: true,
      data: {
        connections,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: connections.length,
          totalRecords: total
        }
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { type = 'received' } = req.query // 'sent' or 'received'

    let query: any
    if (type === 'sent') {
      query = { requester: userId, status: 'pending' }
    } else {
      query = { recipient: userId, status: 'pending' }
    }

    const requests = await Connection.find(query)
      .populate('requester', 'firstName lastName email profileImage company jobTitle')
      .populate('recipient', 'firstName lastName email profileImage company jobTitle')
      .sort({ requestedAt: -1 })

    res.json({
      success: true,
      data: requests
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Contact Management
export const createContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const contactData = { ...req.body, owner: userId }

    const contact = new Contact(contactData)
    await contact.save()

    // Log networking activity
    const activity = new NetworkingActivity({
      user: userId,
      contact: contact._id,
      activityType: 'note_added',
      description: `Added new contact: ${contact.firstName} ${contact.lastName}`
    })
    await activity.save()

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact created successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { 
      page = 1, 
      limit = 20, 
      search, 
      relationship, 
      industry, 
      isFavorite,
      tags 
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    let query: any = { owner: userId, isActive: true }

    if (relationship) query.relationship = relationship
    if (industry) query.industry = industry
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true'
    if (tags) {
      const tagArray = (tags as string).split(',')
      query.tags = { $in: tagArray }
    }

    let contacts
    if (search) {
      contacts = await (Contact as any).searchContacts(userId, search as string)
        .skip(skip)
        .limit(limitNum)
    } else {
      contacts = await (Contact as any).findByOwner(userId, query)
        .skip(skip)
        .limit(limitNum)
    }

    const total = await Contact.countDocuments(query)

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: contacts.length,
          totalRecords: total
        }
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contactId } = req.params
    const userId = req.user._id

    const contact = await Contact.findOne({ _id: contactId, owner: userId })
      .populate('user', 'firstName lastName email profileImage')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    // Get interaction history
    const activities = await (NetworkingActivity as any).getContactHistory(userId, contactId)

    res.json({
      success: true,
      data: {
        contact,
        activities
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contactId } = req.params
    const userId = req.user._id
    const updates = req.body

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email profileImage')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contactId } = req.params
    const userId = req.user._id

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { isActive: false },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Networking Activity
export const getNetworkingActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { limit = 20 } = req.query

    const activities = await (NetworkingActivity as any).getActivityFeed(userId, parseInt(limit as string))

    res.json({
      success: true,
      data: activities
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getFollowUpTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id

    const followUps = await (NetworkingActivity as any).getFollowUpActivities(userId)

    res.json({
      success: true,
      data: followUps
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const recordNetworkingActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id
    const activityData = { ...req.body, user: userId }

    const activity = new NetworkingActivity(activityData)
    await activity.save()

    // Update contact's last interaction if contact is specified
    if (activity.contact) {
      await Contact.findByIdAndUpdate(activity.contact, {
        lastInteraction: new Date(),
        $inc: { interactionCount: 1 }
      })
    }

    await activity.populate('contact', 'firstName lastName company profileImage')

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Activity recorded successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
