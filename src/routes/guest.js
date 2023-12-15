const express = require("express");
const router = express.Router();

const {
  getGuests,
  getGuestDetails,
  updateGuest,
  deleteGuest,
} = require("../controllers/guestController");

/**
 * @swagger
 * tags:
 *   name: Guests
 *   description: Operations related to Badminton guests
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Guest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the guest
 *         userName:
 *           type: string
 *           description: The name of the guest
 *         team:
 *           type: object
 *           description: The team information of the guest
 *           properties:
 *             id:
 *               type: integer
 *               description: The ID of the team
 *             teamName:
 *               type: string
 *               description: The name of the team
 *       example:
 *         id: 1
 *         userName: "GuestUser"
 *         team:
 *           id: 1
 *           teamName: "GuestTeam"
 */

/**
 * @swagger
 * /api/v1/guests:
 *   get:
 *     summary: Get all guests
 *     tags: [Guests]
 *     responses:
 *       200:
 *         description: Guests retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               guests:
 *                 - id: 1
 *                   userName: "GuestUser1"
 *                   team:
 *                     id: 1
 *                     teamName: "GuestTeam1"
 *                 - id: 2
 *                   userName: "GuestUser2"
 *                   team:
 *                     id: 2
 *                     teamName: "GuestTeam2"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/guests/{id}:
 *   get:
 *     summary: Get details of a specific guest
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guest to fetch
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               guest:
 *                 id: 1
 *                 userName: "GuestUser"
 *                 team:
 *                   id: 1
 *                   teamName: "GuestTeam"
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update details of a specific guest
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guest to update
 *         schema:
 *           type: integer
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
 *         description: Guest updated successfully
 *         content:
 *           application/json:
 *             example:
 *               guest:
 *                 id: 1
 *                 userName: "UpdatedGuestUser"
 *                 team:
 *                   id: 1
 *                   teamName: "GuestTeam"
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a specific guest
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guest to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Guest deleted successfully"
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal server error
 */

router.route("/guests").get(getGuests);
router
  .route("/guests/:id")
  .get(getGuestDetails)
  .put(updateGuest)
  .delete(deleteGuest);

module.exports = router;
