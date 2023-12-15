const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  createGuest,
  loginGuest,
} = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and Guest creation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         userName:
 *           type: string
 *           description: User's Username
 *         avatar:
 *           type: string
 *           description: URL of the User's Avatar
 *         password:
 *           type: string
 *           description: User's Password
 *         role:
 *           type: string
 *           description: User's role (e.g., "COORDINATOR","ADMIN" or "MEMBER")
 *       example:
 *         email: test@example.com
 *         userName: testuser
 *         avatar: https://example.com/avatar.jpg
 *         password: password123
 *         role: COORDINATOR
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 email: test@example.com
 *                 userName: testuser
 *                 avatar: https://example.com/avatar.jpg
 *                 role: user
 *               token: <user_token>
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - userName
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 email: test@example.com
 *                 userName: testuser
 *                 avatar: https://example.com/avatar.jpg
 *                 role: user
 *               token: <user_token>
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/guests:
 *   post:
 *     summary: Create a new guest user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestName:
 *                 type: string
 *               avatar:
 *                 type: string
 *             required:
 *               - guestName
 *               - avatar
 *     responses:
 *       201:
 *         description: Guest user created successfully
 *         content:
 *           application/json:
 *             example:
 *               guest:
 *                 guestName: guestuser
 *                 avatar: https://example.com/guest_avatar.jpg
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/loginGuest:
 *   post:
 *     summary: Login as a guest user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestName:
 *                 type: string
 *             required:
 *               - guestName
 *     responses:
 *       200:
 *         description: Guest user logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               guest:
 *                 guestName: guestuser
 *                 avatar: https://example.com/guest_avatar.jpg
 *               token: <guest_token>
 *       401:
 *         description: Invalid guest credentials
 *       500:
 *         description: Internal server error
 */

router.route("/register").post(register);
router.route("/guests").post(createGuest);
router.route("/login").post(login);
router.route("/loginGuest").post(loginGuest);
router.route("/logout").post(logout);

module.exports = router;
