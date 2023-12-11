const { Game, Queue, Team, Court, RecentWinners } = require("../model/index");

async function findCourtById(courtId) {
  const court = await Court.findByPk(courtId);
  return court;
}

async function findPendingQueuePairs(courtId) {
  const queuePairs = await Queue.findAll({
    where: { status: "PENDING", courtId: courtId },
    order: [["timestamp", "ASC"]],
    limit: 2,
  });
  return queuePairs;
}

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

async function findGame(gameId) {
  const game = await Game.findByPk(gameId, {
    include: [
      { model: Team, as: "TeamA" },
      { model: Team, as: "TeamB" },
    ],
  });
  return game;
}

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
