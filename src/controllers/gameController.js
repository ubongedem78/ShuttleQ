const { Game, Court, Team, Queue, CourtQueue } = require("../model");

// Create A Game
const createGame = async (req, res) => {
  try {
    const { gameType, teamAId, teamBId, courtId } = req.body;

    const [teamA, teamB, courtQueue] = await Promise.all([
      Team.findByPk(teamAId),
      Team.findByPk(teamBId),
      Queue.findOne({
        where: {
          courtId,
        },
      }),
    ]);

    console.log("teamA", teamA);
    console.log("teamB", teamB);

    // You want to check if the teams exist
    if (!teamA || !teamB) {
      return res
        .status(400)
        .send({ message: "One or both of the teams do not exist" });
    }

    // You want to check if the court & queue exists
    if (!courtQueue) {
      return res.status(400).json({ message: "CourtQueue does not exist" });
    }

    console.log("courtqueue", courtQueue);

    //check gameType for teamA and teamB
    if (teamA.gameType !== gameType && teamB.gameType !== gameType) {
      return res.status(400).json({
        message: "Cannot create a game with teams of different game types",
      });
    }

    // Check if the queue has enough players to start a game for each type(2 players/teams singles and 4 players/2 teams for doubles)
    if (gameType === "SINGLES" && courtQueue.length < 2) {
      return res
        .status(400)
        .json({ message: "Not enough players to start a singles game" });
    } else if (gameType === "DOUBLES" && courtQueue.length < 4) {
      return res
        .status(400)
        .json({ message: "Not enough players to start a doubles game" });
    }

    // Check if teams are in the same court's queue
    if (teamA.courtId !== teamB.courtId) {
      return res
        .status(400)
        .send({ message: "Teams are not in the same court" });
    }

    // Check if game type is valid
    if (!["SINGLES", "DOUBLES"].includes(gameType.toUpperCase())) {
      return res.status(400).send({ message: "Invalid game type" });
    }

    // Create game finally
    const game = await Game.create({
      gameType: gameType.toUpperCase(),
      teamAId: teamA.id,
      teamBId: teamB.id,
      courtId: courtId,
      status: "PENDING",
    });

    res.status(201).send({ message: "Game created successfully", game });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create game" });
  }
};

// Get Game Details using gameId
const getGameDetails = async (req, res) => {
  try {
    const { gameId } = req.params; // Assuming gameId is passed as a route parameter

    if (!gameId) {
      return res.status(400).send({ message: "Invalid game ID" });
    }

    const game = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "TeamA" },
        { model: Team, as: "TeamB" },
        // { model: Queue },
      ],
    });

    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    // Return game details
    res
      .status(200)
      .send({ message: "Game details retrieved successfully", game });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to get game details" });
  }
};

// Start Game
const startGame = async (req, res) => {
  try {
    const { gameId, winnerId } = req.body;

    if (!gameId) {
      return res.status(400).send({ message: "Invalid game ID" });
    }
    const game = await Game.findByPk(gameId);
    console.log("game", game);
    if (!game) {
      return res.status(400).send({ message: "Game does not exist" });
    }

    if (game.status !== "PENDING") {
      return res.status(400).json({
        message: "Cannot start a game that is not in the PENDING state",
      });
    }

    if (winnerId) {
      console.log("checking winnerId", winnerId);
      const winnerTeam = await Team.findByPk(winnerId);
      const loserTeam = winnerTeam === game.teamA ? game.teamB : game.teamA;

      // Update win counts
      winnerTeam.consecutiveWins += 1;
      winnerTeam.save();

      loserTeam.consecutiveWins = 0;
      loserTeam.save();
    }

    // Update game status
    game.status = "PLAYING";
    game.save();

    res.status(200).send({ message: "Game started successfully", game });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to start game" });
  }
};

// End Game
const endGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(400).send({ message: "Game does not exist" });
    }

    if (game.status !== "PLAYING") {
      return res.status(400).json({
        message: "Cannot end a game that is not in the PLAYING state",
      });
    }

    // Queue logic based on consecutive wins
    const winnerTeamId =
      game.teamA.consecutiveWins === 2 ? game.teamAId : game.teamBId;
    const loserTeamId =
      winnerTeamId === game.teamAId ? game.teamBId : game.teamAId;

    const winnerTeam = await Team.findByPk(winnerTeamId);
    const loserTeam = await Team.findByPk(loserTeamId);

    winnerTeam.consecutiveWins = 0;
    loserTeam.consecutiveWins = 0;
    await Promise.all([winnerTeam.save(), loserTeam.save()]);

    const queue = await Queue.findAll({
      where: {
        gameType: game.gameType,
        teamId: {
          [Op.ne]: loserTeamId,
        },
      },
      order: [["timestamp", "ASC"]],
    });

    if (winnerTeam.consecutiveWins === 2) {
      queue.push({
        teamId: loserTeam.id,
        gameType: game.gameType,
        status: "PENDING",
        playerId: loserTeam.player1Id,
        playerName: `${loserTeam.player1.firstName}/${loserTeam.player2.firstName}`,
        courtId: game.courtId,
        timestamp: new Date(),
      });
    }

    await Queue.bulkCreate(queue, { updateOnDuplicate: ["timestamp"] });

    res.status(200).send({ message: "Game ended successfully", game });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to end game" });
  }
};

module.exports = { createGame, getGameDetails, startGame, endGame };
