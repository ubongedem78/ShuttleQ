const { Game, Queue, Team, Court, RecentWinners } = require("../model/index");

/**
 * Finds a court by its ID.
 *
 * @param {number} courtId - The ID of the court to search for.
 * @returns {Promise<import('../model/Court') | null>} A Promise that resolves to the found court or null if not found.
 */
async function findCourtById(courtId) {
  const court = await Court.findByPk(courtId);
  return court;
}

/**
 * Finds pending queue pairs for a specific court.
 *
 * @param {number} courtId - The ID of the court for which to find pending queue pairs.
 * @returns {Promise<import('../model/Queue')[]>} A Promise that resolves to an array of pending queue pairs.
 */
async function findPendingQueuePairs(courtId) {
  const queuePairs = await Queue.findAll({
    where: { status: "PENDING", courtId: courtId },
    order: [["timestamp", "ASC"]],
    limit: 2,
  });
  return queuePairs;
}

/**
 * Creates a new game based on given queue pairs, game type, and court ID.
 *
 * @param {import('../model/Queue')[]} queuePairs - An array of queue pairs representing teams.
 * @param {string} gameType - The type of the game.
 * @param {number} courtId - The ID of the court where the game is played.
 * @returns {Promise<import('../model/Game')>} A Promise that resolves to the newly created game.
 */
async function createGame(queuePairs, gameType, courtId) {
  const game = await Game.create({
    gameType,
    teamAId: queuePairs[0].teamId,
    teamBId: queuePairs[1].teamId,
    teamAName: queuePairs[0].playerName,
    teamBName: queuePairs[1].playerName,
    status: "PLAYING",
    courtId,
  });
  return game;
}

/**
 * Updates the status of queue pairs and teams after a game has been created.
 *
 * @param {import('../model/Queue')[]} queuePairs - An array of queue pairs to be updated.
 * @returns {Promise<void>} A Promise that resolves when the updates are complete.
 */
async function updateQueueAndTeams(queuePairs) {
  await Promise.all([
    Queue.update(
      { status: "PLAYING" },
      { where: { id: queuePairs.map((pair) => pair.id) } }
    ),
    Team.update(
      { isActive: true },
      { where: { id: queuePairs.map((pair) => pair.teamId) } }
    ),
  ]);
}

/**
 * Finds a game by its ID, including associated team information.
 *
 * @param {number} gameId - The ID of the game to search for.
 * @returns {Promise<import('../model/Game') | null>} A Promise that resolves to the found game or null if not found.
 */
async function findGame(gameId) {
  const game = await Game.findByPk(gameId, {
    include: [
      { model: Team, as: "TeamA" },
      { model: Team, as: "TeamB" },
    ],
  });
  return game;
}

/**
 * Ends a game, updating the winner, scores, and performing related actions.
 *
 * @param {import('../model/Game')} game - The game to be ended.
 * @param {number | null} winnerId - The ID of the winning team or null if the game ended without a winner.
 * @param {number} teamAScore - The score of Team A.
 * @param {number} teamBScore - The score of Team B.
 * @returns {Promise<void>} A Promise that resolves when the game has been ended and related actions are completed.
 */
async function endGame(game, winnerId, teamAScore, teamBScore) {
  if (winnerId) {
    await game.update({ winnerId, teamAScore, teamBScore, status: "ENDED" });
  } else {
    await game.update({ status: "ENDED" });
  }

  const winnerTeam = game.winnerId === game.teamAId ? game.TeamA : game.TeamB;
  const loserTeam = game.winnerId === game.teamAId ? game.TeamB : game.TeamA;

  await winnerTeam.increment("consecutiveWins");

  if (winnerTeam.consecutiveWins === 2) {
    await winnerTeam.update({ consecutiveWins: 0 });
    await Queue.update(
      { timestamp: new Date(), status: "PENDING" },
      { where: { teamId: winnerTeam.id, status: "PLAYING" } }
    );
    await loserTeam.update({ consecutiveWins: 0 });
    await Queue.update(
      { timestamp: new Date(), status: "PENDING" },
      { where: { teamId: loserTeam.id, status: "PLAYING" } }
    );
  } else {
    await Queue.update(
      { status: "PENDING" },
      { where: { teamId: winnerTeam.id, status: "PLAYING" } }
    );

    await RecentWinners.create({
      teamId: winnerTeam.id,
      gameType: winnerTeam.gameType,
      consecutiveWins: winnerTeam.consecutiveWins,
      timestamp: new Date(),
    });

    await loserTeam.update({ consecutiveWins: 0 });

    await Queue.update(
      { timestamp: new Date(), status: "PENDING" },
      { where: { teamId: loserTeam.id, status: "PLAYING" } }
    );
  }
}

module.exports = {
  findCourtById,
  findPendingQueuePairs,
  createGame,
  updateQueueAndTeams,
  findGame,
  endGame,
};
