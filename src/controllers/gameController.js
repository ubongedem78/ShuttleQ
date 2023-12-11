const { Game, Queue, Team, Court, RecentWinners } = require("../model/index");
const { updateQueueAndTeams } = require("../utils/gameUtils");

// Create Game
const createAndStartGame = async (req, res) => {
  try {
    // Get the first two pairs from the queue of a particular court
    const courtId = req.body.courtId;
    const gameType = req.body.gameType;
    const court = await Court.findByPk(courtId);
    if (!court) {
      return res.status(404).json({ error: "Court not found." });
    }

    console.log("courtId", courtId);
    console.log("gameType", gameType);
    const queuePairs = await Queue.findAll({
      where: { status: "PENDING", courtId: courtId },
      order: [["timestamp", "ASC"]],
      limit: 2,
    });
    console.log("queuePairs", queuePairs);

    if (queuePairs.length < 2) {
      console.log("I am in the queuePairs.length === 1 block");
      res.status(400).json({ error: "Not enough players in the queue." });
      return;
    }
    // Create a new game
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

    // Get game details
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

    // Get game details
    const game = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "TeamA" },
        { model: Team, as: "TeamB" },
      ],
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Update the game with winnerId & the game status to "ENDED"
    if (winnerId) {
      await game.update({ winnerId, teamAScore, teamBScore, status: "ENDED" });
      console.log("i have updated status to ended");
    } else {
      await game.update({ status: "ENDED" });
    }

    // Update the queue and teams based on the game outcome
    const winnerTeam = game.winnerId === game.teamAId ? game.TeamA : game.TeamB;
    const loserTeam = game.winnerId === game.teamAId ? game.TeamB : game.TeamA;

    // Increment the consecutiveWins count for the winning team
    await winnerTeam.increment("consecutiveWins");
    console.log("I have incremented winning teams consecutive wins count");

    // Check if the winning team has won two consecutive games
    if (winnerTeam.consecutiveWins === 2) {
      console.log("I am in the winner is 2 block");
      // Reset the consecutiveWins count for the winning team
      await winnerTeam.update({ consecutiveWins: 0 });
      console.log("I have updated winning teams consecutive wins count");

      //update timestamp of the winning team to current timestamp
      await Queue.update(
        { timestamp: new Date(), status: "PENDING" },
        { where: { teamId: winnerTeam.id, status: "PLAYING" } }
      );

      console.log("I have updated winning on queue table");

      // Reset the consecutiveWins count for the losing team
      await loserTeam.update({ consecutiveWins: 0 });
      console.log("I have updated losing teams consecutive wins count");

      // update the timestamp and status of the losing team to current timestamp and PENDING
      await Queue.update(
        { timestamp: new Date(), status: "PENDING" },
        { where: { teamId: loserTeam.id, status: "PLAYING" } }
      );
      console.log("I have updated losing on queue table");
    } else {
      // update status to pending for the winning team
      await Queue.update(
        { status: "PENDING" },
        { where: { teamId: winnerTeam.id, status: "PLAYING" } }
      );

      // Store the winning team as a recent winner
      await RecentWinners.create({
        teamId: winnerTeam.id,
        gameType: winnerTeam.gameType,
        consecutiveWins: winnerTeam.consecutiveWins,
        timestamp: new Date(),
      });

      // Reset the consecutiveWins count for the losing team
      await loserTeam.update({ consecutiveWins: 0 });

      // Update the timestamp for losing team to the current timestamp
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
