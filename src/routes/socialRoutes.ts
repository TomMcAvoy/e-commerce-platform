import express from 'express';
import { body, param } from 'express-validator';
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
import { validate } from '../middleware/validation';
import { requireRole } from '../middleware/roles';

const router = express.Router();

/**
 * @swagger
 * /api/social/posts:
 *   get:
 *     summary: Get social media posts with filtering
 *     tags: [Social Media]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [pets, obscure, breaking-news, local-community, student-life, teen-zone, global-discussions, technology, health-wellness, entertainment, sports, food-cooking, travel, fashion-beauty, home-garden, business-finance, education, relationships, hobbies-crafts, politics]
 *         description: Filter posts by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *       - in: query
 *         name: safetyLevel
 *         schema:
 *           type: string
 *           enum: [kids, teens, adults]
 *           default: adults
 *         description: Content safety filtering level
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *       400:
 *         description: Invalid query parameters
 */
router.get('/posts', getPosts);

/**
 * @swagger
 * /api/social/posts:
 *   post:
 *     summary: Create a new social media post with auto-categorization and moderation
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - category
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Post content (will be analyzed and potentially moderated)
 *               category:
 *                 type: string
 *                 enum: [pets, obscure, breaking-news, local-community, student-life, teen-zone, global-discussions, technology, health-wellness, entertainment, sports, food-cooking, travel, fashion-beauty, home-garden, business-finance, education, relationships, hobbies-crafts, politics]
 *                 description: Initial category (may be changed by AI analysis)
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional topics (AI will suggest better ones if needed)
 *     responses:
 *       201:
 *         description: Post created successfully with analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 post:
 *                   $ref: '#/components/schemas/SocialPost'
 *                 analysis:
 *                   type: object
 *                   properties:
 *                     wasModerated:
 *                       type: boolean
 *                       description: Whether content was rewritten for community standards
 *                     wasRecategorized:
 *                       type: boolean
 *                       description: Whether post was moved to a different category
 *                     originalCategory:
 *                       type: string
 *                       description: Original category if post was recategorized
 *                     suggestedTopics:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: AI-suggested relevant topics
 *                     confidenceScore:
 *                       type: integer
 *                       description: AI confidence in categorization (0-100)
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 */
router.post('/posts', [
  auth,
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
  body('category')
    .isIn(['pets', 'obscure', 'breaking-news', 'local-community', 'student-life', 'teen-zone', 'global-discussions', 'technology', 'health-wellness', 'entertainment', 'sports', 'food-cooking', 'travel', 'fashion-beauty', 'home-garden', 'business-finance', 'education', 'relationships', 'hobbies-crafts', 'politics'])
    .withMessage('Invalid category'),
  body('topics')
    .optional()
    .isArray()
    .withMessage('Topics must be an array'),
  validate
], createPost);

/**
 * @swagger
 * /api/social/posts/{postId}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 */
router.post('/posts/:postId/like', [
  auth,
  param('postId').isMongoId().withMessage('Invalid post ID'),
  validate
], likePost);

/**
 * @swagger
 * /api/social/posts/{postId}/report:
 *   post:
 *     summary: Report a post for inappropriate content
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [spam, harassment, inappropriate, off-topic, misinformation]
 *                 description: Reason for reporting
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Additional details about the report
 *     responses:
 *       200:
 *         description: Post reported successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 */
router.post('/posts/:postId/report', [
  auth,
  param('postId').isMongoId().withMessage('Invalid post ID'),
  body('reason')
    .isIn(['spam', 'harassment', 'inappropriate', 'off-topic', 'misinformation'])
    .withMessage('Invalid report reason'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  validate
], reportPost);

/**
 * @swagger
 * /api/social/posts/{postId}/moderate:
 *   post:
 *     summary: Moderate a post (admin/moderator only)
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, flag, remove, reanalyze]
 *                 description: Moderation action to take
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: Reason for the action (required for remove)
 *     responses:
 *       200:
 *         description: Post moderated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Post not found
 */
router.post('/posts/:postId/moderate', [
  auth,
  requireRole(['admin', 'moderator']),
  param('postId').isMongoId().withMessage('Invalid post ID'),
  body('action')
    .isIn(['approve', 'flag', 'remove', 'reanalyze'])
    .withMessage('Invalid moderation action'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must be 500 characters or less'),
  validate
], moderatePost);

/**
 * @swagger
 * /api/social/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/notifications', auth, getUserNotifications);

/**
 * @swagger
 * /api/social/notifications/{notificationId}/read:
 *   post:
 *     summary: Mark notification as read
 *     tags: [Social Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Authentication required
 */
router.post('/notifications/:notificationId/read', [
  auth,
  param('notificationId').isString().withMessage('Invalid notification ID'),
  validate
], markNotificationRead);

export default router;