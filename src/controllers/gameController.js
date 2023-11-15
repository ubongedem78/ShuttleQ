const { Game, Team, Queue } = require("../model");

// Get Player Names
const getPlayerNames = async (playerIds) => {
  const playerNames = await Promise.all(
    playerIds.map(async (playerId) => {
      const player = await Queue.findOne({
        attributes: ["playerName"],
        where: { playerId },
      });
      return player ? player.playerName : null;
    })
  );
  return playerNames;
};

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
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).send({ message: "Invalid game ID" });
    }

    const game = await Game.findByPk(gameId, {
      include: [
        { model: Team, as: "TeamA" },
        { model: Team, as: "TeamB" },
      ],
    });

    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    // Get player names
    const teamAPlayerNames = await getPlayerNames([
      game.TeamA.player1Id,
      game.TeamA.player2Id,
    ]);
    const teamBPlayerNames = await getPlayerNames([
      game.TeamB.player1Id,
      game.TeamB.player2Id,
    ]);

    if (game.gameType === "SINGLES") {
      game.teamAName = teamAPlayerNames[0];
      game.teamBName = teamBPlayerNames[0];
    } else {
      game.teamAName = `${teamAPlayerNames[0]}/${teamAPlayerNames[1]}`;
      game.teamBName = `${teamBPlayerNames[0]}/${teamBPlayerNames[1]}`;
    }

    //update playerNames
    await Promise.all([
      game.update({ teamAName: game.teamAName }),
      game.update({ teamBName: game.teamBName }),
    ]);

    console.log("teamAName", game.teamAName);
    console.log("teamBName", game.teamBName);

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
    //if winner id is null at the first game of the day then both teams will have 0 wins

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
