const {
  findCourtById,
  findPendingQueuePairs,
  createGame,
  updateQueueAndTeams,
  findGame,
  endGame,
} = require("../utils/gameUtils");

// Create Game
const startGameController = async (req, res, next) => {
  try {
    const { courtId, gameType } = req.body;

    await findCourtById(courtId);

    const queuePairs = await findPendingQueuePairs(courtId);

    const game = await createGame(queuePairs, gameType, courtId);

    await updateQueueAndTeams(queuePairs);

    res.status(201).json({ success: true, game });
  } catch (error) {
    next(error);
  }
};

// Fetch Game Details
const fetchGameDetails = async (req, res, next) => {
  try {
    const gameId = req.params.gameId;

    const game = await findGame(gameId);

    res.status(200).json({ success: true, game });
  } catch (error) {
    next(error);
  }
};

// End Game
const endGameController = async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    const { winnerId, teamAScore, teamBScore } = req.body;

    const game = await findGame(gameId);

    await endGame(game, winnerId, teamAScore, teamBScore);

    res.status(200).json({ success: true, message: "Game ended" });
  } catch (error) {
    next(error);
  }
};

module.exports = { startGameController, fetchGameDetails, endGameController };
