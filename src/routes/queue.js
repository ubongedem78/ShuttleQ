const express = require("express");
const router = express.Router();
const {
  getQueue,
  getQueueForCourt,
  deleteTeamFromQueue,
} = require("../controllers/queueController");

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: Operations related to the Badminton queue
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamInQueue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the team in the queue
 *         playerName:
 *           type: string
 *           description: The name of the player in the team
 *         courtId:
 *           type: integer
 *           description: The ID of the court to which the team belongs
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp indicating when the team joined the queue
 *       example:
 *         id: 1
 *         playerName: "Player1"
 *         courtId: 1
 *         timestamp: "2023-01-01T12:00:00Z"
 */

/**
 * @swagger
 * /api/v1/queues:
 *   get:
 *     summary: Get all teams in the pending queue
 *     tags: [Queue]
 *     responses:
 *       200:
 *         description: Teams in the pending queue retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: 1
 *                   playerName: "Player1"
 *                   courtId: 1
 *                   timestamp: "2023-01-01T12:00:00Z"
 *                 - id: 2
 *                   playerName: "Player2"
 *                   courtId: 2
 *                   timestamp: "2023-01-01T12:05:00Z"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/queues/{courtId}:
 *   get:
 *     summary: Get the queue for a specific court
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         description: ID of the court to fetch the queue for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Queue for the specified court retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: 1
 *                   playerName: "Player1"
 *                   courtId: 1
 *                   timestamp: "2023-01-01T12:00:00Z"
 *                 - id: 2
 *                   playerName: "Player2"
 *                   courtId: 1
 *                   timestamp: "2023-01-01T12:05:00Z"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/queues/{teamId}:
 *   delete:
 *     summary: Delete a team from the queue
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team to delete from the queue
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team deleted from the queue successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "Team deleted successfully"
 *       404:
 *         description: Team not found in the queue
 *       500:
 *         description: Internal server error
 */

router.get("/queues", getQueue);
router.get("/queues/:courtId", getQueueForCourt);
router.delete("/queues/:teamId", deleteTeamFromQueue);

module.exports = router;
