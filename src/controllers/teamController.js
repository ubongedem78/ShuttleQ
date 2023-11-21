const { Team, User, Queue, Court } = require("../model");
const { Op } = require("sequelize");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { gameType, playerNames, courtId } = req.body;

    // Validation for gameType
    const formattedGameType = gameType && gameType.toUpperCase();

    if (
      !formattedGameType ||
      !["SINGLES", "DOUBLES"].includes(formattedGameType)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid gameType",
      });
    }

    // Validation for playerNames
    if (typeof playerNames !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Player Names must be a string",
      });
    }

    // Split player names by commas and trim whitespace for each player
    const players = playerNames
      .split(",")
      .map((playerName) => playerName.trim());

    // Get the total number of players
    const numberOfPlayers = players.length;

    // Check the formattedGameType and validate the number of players accordingly
    switch (formattedGameType) {
      case "DOUBLES":
        // Check if the number of players for DOUBLES is exactly 2
        if (numberOfPlayers !== 2) {
          return res.status(400).json({
            status: "error",
            message: "For DOUBLES, you must provide exactly 2 players",
          });
        }
        break;

      case "SINGLES":
        // Check if the number of players for SINGLES is exactly 1
        if (numberOfPlayers !== 1) {
          return res.status(400).json({
            status: "error",
            message: "For SINGLES, you must provide exactly 1 player",
          });
        }
        break;

      default:
        // Return an error for invalid gameType
        return res.status(400).json({
          status: "error",
          message: "Invalid gameType",
        });
    }

    const userIDs = [];
    const users = await User.findAll({
      where: {
        userName: {
          [Op.or]: players.map((playerName) => ({
            [Op.iLike]: `%${playerName}`,
          })),
        },
      },
    });
    console.log("users", users);

    // Here I will create a map that associates user first names with their IDs
    const userMap = new Map(users.map((user) => [user.userName.toUpperCase(), user.id]));
    console.log("userMap", userMap);

    // Iterate over each player name in the 'players' array
    for (const playerName of players) {
      const formattedPlayerName = playerName.toUpperCase();
      console.log("formattedPlayerName", formattedPlayerName);
      // Retrieve the user ID from the map based on the player name
      const userID = userMap.get(formattedPlayerName);
      console.log("userID", userID);
      // Check if a user ID was found for the current player
      if (userID) {
        userIDs.push(userID);
      } else {
        return res.status(400).json({
          status: "error",
          message: `Player with name ${playerName} does not exist`,
        });
      }
    }

    // Create Team
    const team = await Team.create({
      gameType: formattedGameType,
      player1Id: userIDs[0],
      player2Id: userIDs[1] || null,
      courtId: courtId || null,
      playerId: userIDs[0],
      isActive: true,
    });

    // Update playerId in User table for all players
    for (const userId of userIDs) {
      await User.update(
        { playerId: team.id },
        {
          where: {
            id: userId,
          },
        }
      );
    }

    // Check if any of the players are already in the queue with a different game type
    const playersInQueueWithDifferentGameType = await Queue.findOne({
      where: {
        courtId,
        playerId: userIDs,
        gameType: { [Op.not]: formattedGameType },
      },
      include: {
        model: Court,
        as: "Court",
        where: {
          courtId,
        },
        required: true,
      },
    });

    if (playersInQueueWithDifferentGameType) {
      return res.status(400).json({
        status: "error",
        message: `Player(s) are already in the queue with a different gameType (${playersInQueueWithDifferentGameType.gameType}). Please wait until they finish playing.`,
      });
    }

    // You want to check if the team or any of its players are already in the queue to avoid creating duplicates in the queue
    const teamInQueue = await Queue.findOne({
      where: {
        [Op.or]: [
          { teamId: team.id, status: { [Op.in]: ["PENDING", "PLAYING"] } },
          { playerId: userIDs, status: { [Op.in]: ["PENDING", "PLAYING"] } },
        ],
        courtId,
      },
    });

    if (teamInQueue) {
      const teamMessage =
        teamInQueue.teamId === team.id
          ? `Team with id ${team.id} is already in the queue`
          : `Player(s) with id ${userIDs.join(" or ")} is already in the queue`;

      return res.status(400).json({
        status: "error",
        message: teamMessage,
      });
    }

    // You also want to check if the team or any of its players are already playing to avoid creating duplicates in the queue
    const teamPlaying = await Queue.findOne({
      where: {
        [Op.or]: [
          { teamId: team.id, status: "PLAYING" },
          { playerId: userIDs, status: "PLAYING" },
        ],
        courtId,
      },
    });

    if (teamPlaying) {
      const teamMessage =
        teamPlaying.teamId === team.id
          ? `Team with id ${team.id} is already playing`
          : `Player(s) with id ${userIDs.join(" or ")} is already playing`;

      return res.status(400).json({
        status: "error",
        message: teamMessage,
      });
    }

    // Make an entry into the queue
    await Queue.create({
      teamId: team.id,
      gameType: formattedGameType,
      status: "PENDING",
      playerId: team.player1Id,
      playerName:
        playerNames.split(",")[0] +
        (playerNames.split(",")[1] ? "/" + playerNames.split(",")[1] : ""),
      courtId,
      timestamp: new Date(),
    });

    return res.status(201).json({ team });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating the team",
    });
  }
};

module.exports = { createTeam };
