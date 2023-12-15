const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to Badminton users
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             example: { users: [{ userId: 1, userName: "User1" }, { userId: 2, userName: "User2" }] }
 *       500:
 *         description: Internal server error

 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { userName: "NewUser", email: "newuser@example.com", age: 25 }
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example: { user: { userId: 3, userName: "NewUser", email: "newuser@example.com", age: 25 } }
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error

 * /api/v1/users/{id}:
 *   get:
 *     summary: Get details of a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to get details for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             example: { user: { userId: 1, userName: "User1", teams: [{ teamId: 1, gameType: "DOUBLES" }] } }
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error

 *   patch:
 *     summary: Update user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { userName: "UpdatedUser", email: "updateduser@example.com", age: 30 }
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             example: { user: { userId: 1, userName: "UpdatedUser", email: "updateduser@example.com", age: 30 } }
 *       400:
 *         description: Bad request or validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.route("/users").get(getAllUsers);
router
  .route("/users/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
