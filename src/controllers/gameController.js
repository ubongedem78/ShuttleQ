const { Game, Queue, Team, Court, RecentWinners } = require("../model/index");
const { updateQueueAndTeams } = require("../utils/gameUtils");

// Create Game
const createAndStartGame = async (req, res) => {
  try {
    const courtId = req.body.courtId;
    const gameType = req.body.gameType;
    const court = await Court.findByPk(courtId);

    if (!court) {
      return res.status(404).json({ error: "Court not found." });
    }

    const queuePairs = await Queue.findAll({
      where: { status: "PENDING", courtId: courtId },
      order: [["timestamp", "ASC"]],
      limit: 2,
    });

    if (queuePairs.length < 2) {
      res.status(400).json({ error: "Not enough players in the queue." });
      return;
    }

    const game = await Game.create({
      gameType: queuePairs[0].gameType,
      teamAId: queuePairs[0].teamId,
      teamBId: queuePairs[1].teamId,
      teamAName: queuePairs[0].playerName,
      teamBName: queuePairs[1].playerName,
      status: "PLAYING",
      courtId: req.body.courtId,
    });

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

    const game = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "TeamA" },
        { model: Team, as: "TeamB" },
      ],
    });

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
const endGame = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { winnerId, teamAScore, teamBScore } = req.body;

    const game = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "TeamA" },
        { model: Team, as: "TeamB" },
      ],
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

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

    return res.status(200).json({ success: true, message: "Game ended." });
  } catch (error) {
    console.error("Error ending game:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createAndStartGame, fetchGameDetails, endGame };
