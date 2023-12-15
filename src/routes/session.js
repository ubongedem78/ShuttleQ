const express = require("express");
const router = express.Router();

const { endSession } = require("../controllers/sessionController");

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Operations related to the Badminton court sessions
 */

/**
 * @swagger
 * /api/v1/sessions/{courtId}:
 *   delete:
 *     summary: End the current session on a specified court
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         description: ID of the court to end the session for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session ended successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Session ended"
 *       404:
 *         description: No teams in the queue or associated with the court
 *       500:
 *         description: Internal server error
 */

router.delete("/sessions/:courtId", endSession);

module.exports = router;
