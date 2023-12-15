const express = require("express");
const router = express.Router();

const {
  startGameController,
  fetchGameDetails,
  endGameController,
} = require("../controllers/gameController");

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Operations related to Badminton games
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         courtId:
 *           type: integer
 *           description: The ID of the court where the game is played
 *         gameType:
 *           type: string
 *           description: The type of the game
 *         teamAId:
 *           type: integer
 *           description: The ID of Team A
 *         teamBId:
 *           type: integer
 *           description: The ID of Team B
 *         teamAName:
 *           type: string
 *           description: The name of Team A
 *         teamBName:
 *           type: string
 *           description: The name of Team B
 *         status:
 *           type: string
 *           enum: [PLAYING, ENDED]
 *           description: The status of the game (PLAYING or ENDED)
 *         winnerId:
 *           type: integer
 *           description: The ID of the winning team (if game is ended)
 *         teamAScore:
 *           type: integer
 *           description: The score of Team A (if game is ended)
 *         teamBScore:
 *           type: integer
 *           description: The score of Team B (if game is ended)
 *       example:
 *         courtId: 1
 *         gameType: "SINGLES"
 *         teamAId: 1
 *         teamBId: 2
 *         teamAName: "Team A"
 *         teamBName: "Team B"
 *         status: "PLAYING"
 */

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Start a new game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courtId:
 *                 type: integer
 *               gameType:
 *                 type: string
 *             required:
 *               - courtId
 *               - gameType
 *     responses:
 *       201:
 *         description: Game started successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               game:
 *                 courtId: 1
 *                 gameType: "SINGLES"
 *                 teamAId: 1
 *                 teamBId: 2
 *                 teamAName: "Team A"
 *                 teamBName: "Team B"
 *                 status: "PLAYING"
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Court not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/games/{gameId}:
 *   get:
 *     summary: Get details of a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID of the game to fetch
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Game details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               game:
 *                 courtId: 1
 *                 gameType: "SINGLES"
 *                 teamAId: 1
 *                 teamBId: 2
 *                 teamAName: "Team A"
 *                 teamBName: "Team B"
 *                 status: "PLAYING"
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: End a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID of the game to end
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               winnerId:
 *                 type: integer
 *               teamAScore:
 *                 type: integer
 *               teamBScore:
 *                 type: integer
 *             required:
 *               - winnerId
 *               - teamAScore
 *               - teamBScore
 *     responses:
 *       200:
 *         description: Game ended successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Game ended"
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */

router.get("/games/:gameId", fetchGameDetails);
router.post("/games", startGameController);
router.put("/games/:gameId", endGameController);

module.exports = router;
