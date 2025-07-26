import mongoose, { Document, Schema, Model } from 'mongoose'

export interface INetworkingActivity extends Document {
  user: mongoose.Types.ObjectId
  contact?: mongoose.Types.ObjectId
  activityType: 'connection_request' | 'connection_accepted' | 'message_sent' | 'meeting_scheduled' | 'call_made' | 'email_sent' | 'note_added' | 'tag_added' | 'favorite_added' | 'profile_viewed' | 'post_liked' | 'post_commented' | 'post_shared'
  description: string
  metadata: {
    subject?: string
    duration?: number
    platform?: string
    meetingType?: string
    location?: string
    outcome?: string
    followUpRequired?: boolean
    followUpDate?: Date
  }
  isPublic: boolean
  relatedPost?: mongoose.Types.ObjectId
  relatedProduct?: mongoose.Types.ObjectId
}

interface INetworkingActivityModel extends Model<INetworkingActivity> {
  getActivityFeed(userId: string, limit?: number): Promise<INetworkingActivity[]>
  getFollowUpActivities(userId: string): Promise<INetworkingActivity[]>
  getContactHistory(userId: string, contactId: string): Promise<INetworkingActivity[]>
}

const NetworkingActivitySchema = new Schema<INetworkingActivity, INetworkingActivityModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    index: true
  },
  activityType: {
    type: String,
    enum: [
      'connection_request',
      'connection_accepted',
      'message_sent',
      'meeting_scheduled',
      'call_made',
      'email_sent',
      'note_added',
      'tag_added',
      'favorite_added',
      'profile_viewed',
      'post_liked',
      'post_commented',
      'post_shared'
    ],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  metadata: {
    subject: { type: String, maxlength: 200 },
    duration: { type: Number, min: 0 }, // in minutes
    platform: { type: String, maxlength: 50 },
    meetingType: { 
      type: String, 
      enum: ['video_call', 'phone_call', 'in_person', 'coffee_chat', 'lunch', 'conference', 'networking_event', 'other']
    },
    location: { type: String, maxlength: 200 },
    outcome: { 
      type: String,
      enum: ['positive', 'neutral', 'negative', 'follow_up_needed', 'no_response']
    },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  relatedPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  relatedProduct: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
NetworkingActivitySchema.index({ user: 1, createdAt: -1 })
NetworkingActivitySchema.index({ contact: 1, createdAt: -1 })
NetworkingActivitySchema.index({ activityType: 1, createdAt: -1 })
NetworkingActivitySchema.index({ user: 1, activityType: 1, createdAt: -1 })
NetworkingActivitySchema.index({ 'metadata.followUpRequired': 1, 'metadata.followUpDate': 1 })

// Static method to get activity feed for user
NetworkingActivitySchema.statics.getActivityFeed = function(userId: string, limit = 20) {
  return this.find({ user: userId })
    .populate('contact', 'firstName lastName company profileImage')
    .populate('relatedPost', 'content author')
    .populate('relatedProduct', 'name price image')
    .sort({ createdAt: -1 })
    .limit(limit)
}

// Static method to get activities requiring follow-up
NetworkingActivitySchema.statics.getFollowUpActivities = function(userId: string) {
  return this.find({
    user: userId,
    'metadata.followUpRequired': true,
    'metadata.followUpDate': { $lte: new Date() }
  })
    .populate('contact', 'firstName lastName company profileImage')
    .sort({ 'metadata.followUpDate': 1 })
}

// Static method to get contact interaction history
NetworkingActivitySchema.statics.getContactHistory = function(userId: string, contactId: string) {
  return this.find({
    user: userId,
    contact: contactId
  })
    .sort({ createdAt: -1 })
}

export default mongoose.models.NetworkingActivity || mongoose.model<INetworkingActivity, INetworkingActivityModel>('NetworkingActivity', NetworkingActivitySchema)
