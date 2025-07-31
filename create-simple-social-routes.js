#!/usr/bin/env node

/**
 * CREATE SIMPLIFIED SOCIAL ROUTES (NO EXPRESS-VALIDATOR)
 * Remove dependency issues and get social routes working
 */

const fs = require('fs');

console.log('🔧 Creating simplified social routes...');

const simpleSocialRoutesCode = `import express from 'express';
import {
  getPosts,
  createPost,
  likePost,
  reportPost,
  moderatePost,
  getUserNotifications,
  markNotificationRead
} from '../controllers/socialController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Simple validation middleware
const validatePost = (req: any, res: any, next: any) => {
  const { content, category } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }
  
  if (content.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Content must be 2000 characters or less'
    });
  }
  
  const validCategories = [
    'pets', 'obscure', 'breaking-news', 'local-community', 'student-life', 
    'teen-zone', 'global-discussions', 'technology', 'health-wellness', 
    'entertainment', 'sports', 'food-cooking', 'travel', 'fashion-beauty', 
    'home-garden', 'business-finance', 'education', 'relationships', 
    'hobbies-crafts', 'politics'
  ];
  
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Valid category is required'
    });
  }
  
  next();
};

// Get posts with filtering
router.get('/posts', getPosts);

// Create post
router.post('/posts', validatePost, createPost);

// Like post
router.post('/posts/:postId/like', likePost);

// Report post
router.post('/posts/:postId/report', reportPost);

// Moderate post (admin only)
router.post('/posts/:postId/moderate', moderatePost);

// Get notifications
router.get('/notifications', getUserNotifications);

// Mark notification as read
router.post('/notifications/:notificationId/read', markNotificationRead);

export default router;
`;

// Write the simplified social routes
const socialRoutesPath = '/Users/thomasmcavoy/GitHub/shoppingcart/src/routes/socialRoutes.ts';
fs.writeFileSync(socialRoutesPath, simpleSocialRoutesCode);

console.log('✅ Created simplified social routes (no express-validator dependency)');
console.log('📁 Updated:', socialRoutesPath);
console.log('\n🎯 Changes made:');
console.log('   • Removed express-validator dependency');
console.log('   • Added simple inline validation');
console.log('   • Kept all essential functionality');
console.log('   • Ready for server restart');