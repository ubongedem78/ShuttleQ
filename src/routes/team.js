const express = require("express");
const router = express.Router();
const { createTeam, getTeamDetails } = require("../controllers/teamController");

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Operations related to Badminton teams
 */

/**
 * @swagger
 * /api/v1/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Team]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             gameType: "DOUBLES"
 *             playerNames: "Player1, Player2"
 *             courtId: 1
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             example:
 *               team: { teamId: 1, gameType: "DOUBLES", players: ["Player1", "Player2"], courtId: 1 }
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: Get details of a team by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team to get details for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: { teamId: 1, gameType: "DOUBLES", players: ["Player1", "Player2"], courtId: 1 }
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */

router.post("/teams", createTeam);
router.get("/teams/:teamId", getTeamDetails);

module.exports = router;
