const { Game, Queue, Team, Court, RecentWinners } = require("../model/index");
const {
  findCourtById,
  findPendingQueuePairs,
  createGame,
  updateQueueAndTeams,
  findGame,
  endGame,
} = require("../utils/gameUtils");

// Create Game
const startGameController = async (req, res) => {
  try {
    const { courtId, gameType } = req.body;

    const court = await findCourtById(courtId);

    if (!court) {
      return res.status(404).json({ error: "Court not found." });
    }

    const queuePairs = await findPendingQueuePairs(courtId);

    if (queuePairs.length < 2) {
      res.status(400).json({ error: "Not enough players in the queue." });
      return;
    }

    const game = await createGame(queuePairs, gameType, courtId);

    await updateQueueAndTeams(queuePairs);

    return res.status(201).json({ success: true, game });
  } catch (error) {
    console.error("Error creating game:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch Game Details
const fetchGameDetails = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    const game = await findGame(gameId);

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    return res.status(200).json({ success: true, game });
  } catch (error) {
    console.error("Error fetching game details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// End Game
const endGameController = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { winnerId, teamAScore, teamBScore } = req.body;

    const game = await findGame(gameId);

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    await endGame(game, winnerId, teamAScore, teamBScore);

    return res.status(200).json({ success: true, message: "Game ended." });
  } catch (error) {
    console.error("Error ending game:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { startGameController, fetchGameDetails, endGameController };
