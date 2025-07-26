import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user for the current tenant
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the tenant (e.g., 'acme-corp').
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [customer, vendor, admin]
 *     responses:
 *       201:
 *         description: User registered successfully. Returns a JWT token.
 *       400:
 *         description: Bad request (e.g., missing fields, tenant ID, or user already exists).
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user for the current tenant
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the tenant (e.g., 'acme-corp').
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token.
 *       401:
 *         description: Invalid credentials for this tenant.
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the profile of the currently logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *       401:
 *         description: Not authorized, token failed.
 */
router.get('/me', protect, getMe);

export default router;