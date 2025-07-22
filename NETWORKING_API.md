# Networking API Documentation

The WhiteStartups shopping platform now includes comprehensive networking functionality similar to LinkedIn. This API allows users to manage connections, contacts, and track networking activities.

## Base URL
```
http://localhost:3000/api/networking
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Connections Management

#### Send Connection Request
```http
POST /connections/request
Content-Type: application/json

{
  "targetUserId": "user_id_to_connect_with",
  "message": "Optional connection message"
}
```

#### Respond to Connection Request
```http
PUT /connections/:connectionId/respond
Content-Type: application/json

{
  "response": "accepted" | "declined"
}
```

#### Get User Connections
```http
GET /connections?status=accepted&page=1&limit=20
```

#### Get Pending Connection Requests
```http
GET /connections/pending
```

### Contact Management

#### Create Contact
```http
POST /contacts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "company": "TechCorp",
  "jobTitle": "Software Engineer",
  "location": "San Francisco, CA",
  "industry": "Technology",
  "bio": "Experienced software engineer...",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "@johndoe",
    "website": "https://johndoe.com"
  },
  "tags": ["networking", "tech", "startup"],
  "notes": "Met at tech conference",
  "relationship": "colleague" | "client" | "vendor" | "friend" | "family" | "other",
  "customFields": {
    "meetingDate": "2025-01-15",
    "referredBy": "Jane Smith"
  }
}
```

#### Get Contacts
```http
GET /contacts?page=1&limit=20&search=john&relationship=colleague&industry=tech&tags=networking
```

#### Get Single Contact
```http
GET /contacts/:contactId
```

#### Update Contact
```http
PUT /contacts/:contactId
Content-Type: application/json

{
  "jobTitle": "Senior Software Engineer",
  "company": "NewTechCorp",
  "notes": "Promoted to senior role"
}
```

#### Delete Contact
```http
DELETE /contacts/:contactId
```

### Activity & Analytics

#### Get Networking Activity Feed
```http
GET /activity?limit=50
```

#### Get Follow-up Tasks
```http
GET /follow-ups
```

#### Record Networking Activity
```http
POST /activity
Content-Type: application/json

{
  "contact": "contact_id",
  "activityType": "meeting" | "email" | "call" | "note" | "follow_up",
  "description": "Had coffee meeting to discuss collaboration",
  "metadata": {
    "duration": 60,
    "location": "Starbucks Downtown",
    "followUpRequired": true,
    "followUpDate": "2025-02-01",
    "followUpAction": "Send proposal"
  },
  "isPublic": false
}
```

## Data Models

### Contact
```typescript
{
  _id: string
  owner: string (user ID)
  user?: string (if contact is also a platform user)
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
  createdAt: Date
  updatedAt: Date
}
```

### Connection
```typescript
{
  _id: string
  requester: string (user ID)
  recipient: string (user ID)
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  message?: string
  mutualConnections: number
  connectionStrength: 'weak' | 'medium' | 'strong'
  lastInteraction?: Date
  requestedAt: Date
  respondedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Networking Activity
```typescript
{
  _id: string
  user: string (user ID)
  contact?: string (contact ID)
  connection?: string (connection ID)
  activityType: 'meeting' | 'email' | 'call' | 'note' | 'follow_up' | 'connection_made' | 'contact_added'
  description: string
  metadata: {
    duration?: number
    location?: string
    followUpRequired: boolean
    followUpDate?: Date
    followUpAction?: string
    [key: string]: any
  }
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Response Format

All API responses follow this format:
```typescript
{
  success: boolean
  data?: any
  message?: string
  error?: string
  pagination?: {
    current: number
    total: number
    count: number
    totalRecords: number
  }
}
```

## Usage Examples

### Complete Networking Workflow

1. **Create a contact**
```bash
curl -X POST http://localhost:3000/api/networking/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","company":"TechCorp","relationship":"colleague"}'
```

2. **Search contacts**
```bash
curl -X GET "http://localhost:3000/api/networking/contacts?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Record an interaction**
```bash
curl -X POST http://localhost:3000/api/networking/activity \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"contact":"CONTACT_ID","activityType":"meeting","description":"Discussed partnership opportunities"}'
```

4. **View activity feed**
```bash
curl -X GET http://localhost:3000/api/networking/activity \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integration with Frontend

The networking database is designed to work seamlessly with the LinkedIn-style layout in the frontend. The activity feed can populate the center column, contact management can be accessed from the left sidebar, and connection suggestions can appear in the right sidebar.
