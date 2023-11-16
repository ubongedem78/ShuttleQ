const { Game, Queue, Team } = require("../model/index");

// Create Game
const createGame = async (req, res) => {
  try {
    // Get the first two pairs from the queue
    const queuePairs = await Queue.findAll({
      where: {
        status: "PENDING",
      },
      order: [["timestamp", "ASC"]],
      limit: 2,
    });

    console.log("queuePairs", queuePairs);

    if (queuePairs.length < 2) {
      return res
        .status(400)
        .json({ error: "Not enough players in the queue." });
    }

    // Create a new game
    const game = await Game.create({
      gameType: queuePairs[0].gameType,
      teamAId: queuePairs[0].teamId,
      teamBId: queuePairs[1].teamId,
      teamAName: queuePairs[0].playerName,
      teamBName: queuePairs[1].playerName,
      status: "PENDING",
      courtId: req.body.courtId, 
    });

    // Update the queue and teams
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

// Start Game
const startGame = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    // Update the game status to "PLAYING"
    const [updatedRows] = await Game.update(
      { status: "PLAYING" },
      { where: { id: gameId, status: "PENDING" } }
    );

    if (updatedRows === 0) {
      return res
        .status(400)
        .json({ error: "Game is already in progress or does not exist." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error starting game:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// End Game
const endGame = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { winnerId } = req.body;

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

    // Update the game with winnerId
    if (winnerId) {
      await game.update({ winnerId });
    }

    // Update the game status to "ENDED"
    await game.update({ status: "ENDED" });

    // Update the queue and teams based on the game outcome
    const winnerTeam = game.winnerId === game.teamAId ? game.TeamA : game.TeamB;
    const loserTeam = game.winnerId === game.teamAId ? game.TeamB : game.TeamA;

    // Check if the winning team has won two consecutive games
    if (winnerTeam.consecutiveWins === 2) {
      // Remove the winning team from the top of the queue
      await Queue.destroy({ where: { id: winnerTeam.queueId } });

      // Re-register the winning team before the recent losers in the queue with a current timestamp
      await Queue.create({
        playerId: winnerTeam.player1Id,
        status: "PENDING",
        playerName:
          winnerTeam.gameType === "DOUBLES"
            ? `${winnerTeam.Player.firstName}/${winnerTeam.Player2.firstName}`
            : winnerTeam.Player.firstName,
        gameType: winnerTeam.gameType,
        courtId: game.courtId,
        timestamp: new Date(),
      });

      // Reset the consecutiveWins count for the winning team
      await winnerTeam.update({ consecutiveWins: 0 });

      // Re-register the losing team into the queue with the current timestamp and reset their consecutiveWins count
      await Queue.create({
        playerId: loserTeam.player1Id,
        status: "PENDING",
        playerName:
          loserTeam.gameType === "DOUBLES"
            ? `${loserTeam.Player.firstName}/${loserTeam.Player2.firstName}`
            : loserTeam.Player.firstName,
        gameType: loserTeam.gameType,
        courtId: game.courtId,
        timestamp: new Date(),
      });

      // Reset the consecutiveWins count for the losing team
      await loserTeam.update({ consecutiveWins: 0 });
    } else {
      // Increment the consecutiveWins count for the winning team
      await winnerTeam.increment("consecutiveWins");

      // Reset the consecutiveWins count for the losing team
      await loserTeam.update({ consecutiveWins: 0 });

      // Store the winning team as a recent winner
      await RecentWinners.create({
        teamId: winnerTeam.id,
        gameType: winnerTeam.gameType,
        consecutiveWins: winnerTeam.consecutiveWins,
        timestamp: new Date(),
      });

      // Re-register the losing team into the queue with the current timestamp
      await Queue.create({
        playerId: loserTeam.player1Id,
        status: "PENDING",
        playerName:
          loserTeam.gameType === "DOUBLES"
            ? `${loserTeam.Player.firstName}/${loserTeam.Player2.firstName}`
            : loserTeam.Player.firstName,
        gameType: loserTeam.gameType,
        courtId: game.courtId,
        timestamp: new Date(),
      });
    }

    return res.status(200).json({ success: true, message: "Game ended." });
  } catch (error) {
    console.error("Error ending game:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createGame, fetchGameDetails, startGame, endGame };
