import mongoose, { Document, Schema } from 'mongoose'

export interface IConnection extends Document {
  requester: mongoose.Types.ObjectId
  recipient: mongoose.Types.ObjectId
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  requestedAt: Date
  respondedAt?: Date
  mutualConnections: number
  connectionNote?: string
  connectionSource: 'profile' | 'suggestion' | 'post' | 'search' | 'import'
  // Instance methods
  getOtherUser(currentUserId: string): mongoose.Types.ObjectId | null
  isActive(): boolean
  canBeModifiedBy(userId: string): boolean
}

export interface IConnectionModel extends mongoose.Model<IConnection> {
  findConnectionBetweenUsers(user1Id: string, user2Id: string): Promise<IConnection | null>
  getConnectionStats(userId: string): Promise<{
    total: number
    pending: number
    accepted: number
    declined: number
    blocked: number
  }>
  getUserConnections(userId: string, status?: string): Promise<IConnection[]>
}

const ConnectionSchema = new Schema<IConnection>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending',
    index: true
  },
  requestedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  respondedAt: {
    type: Date
  },
  mutualConnections: {
    type: Number,
    default: 0
  },
  connectionNote: {
    type: String,
    maxlength: 300
  },
  connectionSource: {
    type: String,
    enum: ['profile', 'suggestion', 'post', 'search', 'import'],
    default: 'profile'
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true })
ConnectionSchema.index({ requester: 1, status: 1 })
ConnectionSchema.index({ recipient: 1, status: 1 })
ConnectionSchema.index({ status: 1, requestedAt: -1 })

// Prevent duplicate connections
ConnectionSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Prevent self-connections
    if (this.requester.toString() === this.recipient.toString()) {
      throw new Error('Cannot create connection to yourself')
    }

    const existingConnection = await mongoose.model('Connection').findOne({
      $or: [
        { requester: this.requester, recipient: this.recipient },
        { requester: this.recipient, recipient: this.requester }
      ]
    })
    
    if (existingConnection) {
      throw new Error('Connection already exists between these users')
    }
  }
  next()
})

// Update respondedAt when status changes from pending
ConnectionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
    this.respondedAt = new Date()
  }
  next()
})

// Post-save hook to update user connection counts
ConnectionSchema.post('save', async function(doc) {
  try {
    // Only update counts when connection is accepted
    if (doc.status === 'accepted') {
      const User = mongoose.model('User')
      
      // Get current connection counts for both users
      const requesterCount = await mongoose.model('Connection').countDocuments({
        $or: [
          { requester: doc.requester, status: 'accepted' },
          { recipient: doc.requester, status: 'accepted' }
        ]
      })
      
      const recipientCount = await mongoose.model('Connection').countDocuments({
        $or: [
          { requester: doc.recipient, status: 'accepted' },
          { recipient: doc.recipient, status: 'accepted' }
        ]
      })

      // Update both users' connection counts
      await User.findByIdAndUpdate(doc.requester, { connectionCount: requesterCount })
      await User.findByIdAndUpdate(doc.recipient, { connectionCount: recipientCount })
    }
  } catch (error) {
    console.error('Error updating connection counts:', error)
  }
})

// Virtual for getting the other user in the connection
ConnectionSchema.virtual('otherUser').get(function() {
  return this.requester.toString() === this.recipient.toString() ? null : this.recipient
})

// Instance Methods
ConnectionSchema.methods.getOtherUser = function(currentUserId: string): mongoose.Types.ObjectId | null {
  if (this.requester.toString() === currentUserId) {
    return this.recipient
  } else if (this.recipient.toString() === currentUserId) {
    return this.requester
  }
  return null
}

ConnectionSchema.methods.isActive = function(): boolean {
  return this.status === 'accepted'
}

ConnectionSchema.methods.canBeModifiedBy = function(userId: string): boolean {
  return this.requester.toString() === userId || this.recipient.toString() === userId
}

// Static Methods
ConnectionSchema.statics.findConnectionBetweenUsers = function(user1Id: string, user2Id: string) {
  return this.findOne({
    $or: [
      { requester: user1Id, recipient: user2Id },
      { requester: user2Id, recipient: user1Id }
    ]
  })
}

ConnectionSchema.statics.getConnectionStats = async function(userId: string) {
  const stats = await this.aggregate([
    {
      $match: {
        $or: [
          { requester: new mongoose.Types.ObjectId(userId) },
          { recipient: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])

  const result = {
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
    blocked: 0
  }

  stats.forEach((stat: any) => {
    result.total += stat.count
    if (stat._id in result) {
      result[stat._id as keyof typeof result] = stat.count
    }
  })

  return result
}

ConnectionSchema.statics.getUserConnections = function(userId: string, status?: string) {
  const query: any = {
    $or: [
      { requester: userId },
      { recipient: userId }
    ]
  }

  if (status) {
    query.status = status
  }

  return this.find(query)
    .populate('requester', 'firstName lastName email profileImage company jobTitle')
    .populate('recipient', 'firstName lastName email profileImage company jobTitle')
    .sort({ requestedAt: -1 })
}

export default mongoose.models.Connection || mongoose.model<IConnection, IConnectionModel>('Connection', ConnectionSchema)
