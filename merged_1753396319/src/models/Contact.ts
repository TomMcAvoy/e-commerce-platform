import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IContact extends Document {
  owner: mongoose.Types.ObjectId
  user?: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  location?: string
  industry?: string
  bio?: string
  profileImage?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    website?: string
  }
  tags: string[]
  notes: string
  relationship: 'colleague' | 'client' | 'vendor' | 'friend' | 'family' | 'other'
  contactSource: 'manual' | 'import' | 'connection' | 'referral'
  lastInteraction?: Date
  interactionCount: number
  isFavorite: boolean
  isActive: boolean
  customFields: Map<string, any>
  recordInteraction(): Promise<IContact>
}

interface IContactMethods {
  recordInteraction(): Promise<IContact>
}

interface IContactModel extends Model<IContact, {}, IContactMethods> {
  findByOwner(ownerId: string, filters?: any): Promise<IContact[]>
  searchContacts(ownerId: string, searchTerm: string): Promise<IContact[]>
}

const ContactSchema = new Schema<IContact, IContactModel, IContactMethods>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
    index: true
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 50,
    index: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
      },
      message: 'Invalid image URL format'
    }
  },
  socialLinks: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  relationship: {
    type: String,
    enum: ['colleague', 'client', 'vendor', 'friend', 'family', 'other'],
    default: 'other',
    index: true
  },
  contactSource: {
    type: String,
    enum: ['manual', 'import', 'connection', 'referral'],
    default: 'manual'
  },
  lastInteraction: {
    type: Date,
    index: true
  },
  interactionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isFavorite: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  customFields: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
ContactSchema.index({ owner: 1, firstName: 1, lastName: 1 })
ContactSchema.index({ owner: 1, company: 1 })
ContactSchema.index({ owner: 1, industry: 1 })
ContactSchema.index({ owner: 1, isFavorite: 1, lastInteraction: -1 })
ContactSchema.index({ owner: 1, relationship: 1 })
ContactSchema.index({ owner: 1, tags: 1 })

// Text search index
ContactSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  company: 'text',
  jobTitle: 'text',
  tags: 'text',
  notes: 'text'
})

// Virtual for full name
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim()
})

// Virtual for initials
ContactSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
})

// Method to update last interaction
ContactSchema.methods.recordInteraction = function() {
  this.lastInteraction = new Date()
  this.interactionCount += 1
  return this.save()
}

// Static method to find contacts by owner with filters
ContactSchema.statics.findByOwner = function(ownerId: string, filters = {}) {
  const query = { owner: ownerId, isActive: true, ...filters }
  return this.find(query)
    .populate('user', 'firstName lastName email profileImage')
    .sort({ isFavorite: -1, lastInteraction: -1, firstName: 1 })
}

// Static method to search contacts
ContactSchema.statics.searchContacts = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $text: { $search: searchTerm }
  }, { score: { $meta: 'textScore' } })
    .populate('user', 'firstName lastName email profileImage')
    .sort({ score: { $meta: 'textScore' } })
}

export default mongoose.models.Contact || mongoose.model<IContact, IContactModel>('Contact', ContactSchema)
