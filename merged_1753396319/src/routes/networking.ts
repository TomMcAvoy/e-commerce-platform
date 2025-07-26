import express from 'express'
import { protect } from '../middleware/auth'
import {
  // Connection routes
  sendConnectionRequest,
  respondToConnectionRequest,
  getConnections,
  getPendingRequests,
  
  // Contact routes
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  
  // Activity routes
  getNetworkingActivity,
  getFollowUpTasks,
  recordNetworkingActivity
} from '../controllers/networkingController'

const router = express.Router()

// Connection routes
router.post('/connections/request', protect as any, sendConnectionRequest as any)
router.put('/connections/:connectionId/respond', protect as any, respondToConnectionRequest as any)
router.get('/connections', protect as any, getConnections as any)
router.get('/connections/pending', protect as any, getPendingRequests as any)

// Contact routes
router.post('/contacts', protect as any, createContact as any)
router.get('/contacts', protect as any, getContacts as any)
router.get('/contacts/:contactId', protect as any, getContact as any)
router.put('/contacts/:contactId', protect as any, updateContact as any)
router.delete('/contacts/:contactId', protect as any, deleteContact as any)

// Activity and follow-up routes
router.get('/activity', protect as any, getNetworkingActivity as any)
router.get('/follow-ups', protect as any, getFollowUpTasks as any)
router.post('/activity', protect as any, recordNetworkingActivity as any)

export default router
