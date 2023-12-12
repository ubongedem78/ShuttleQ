const { Team, User, Queue, Guest } = require("../model");
const { Op } = require("sequelize");

async function validateGameType(gameType) {
  const formattedGameType = gameType && gameType.toUpperCase();

  if (
    !formattedGameType ||
    !["SINGLES", "DOUBLES"].includes(formattedGameType)
  ) {
    throw new Error("Invalid gameType");
  }

  return formattedGameType;
}

async function validatePlayerNames(playerNames, formattedGameType) {
  if (typeof playerNames !== "string") {
    throw new Error("Player Names must be a string");
  }

  const players = playerNames.split(",").map((playerName) => playerName.trim());
  const numberOfPlayers = players.length;

  switch (formattedGameType) {
    case "DOUBLES":
      if (numberOfPlayers !== 2) {
        throw new Error("For DOUBLES, you must provide exactly 2 players");
      }
      break;

    case "SINGLES":
      if (numberOfPlayers !== 1) {
        throw new Error("For SINGLES, you must provide exactly 1 player");
      }
      break;

    default:
      throw new Error("Invalid gameType");
  }

  return players;
}

async function findUserIDs(players) {
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

  const userMap = new Map(
    users.map((user) => [user.userName.toUpperCase(), user.id])
  );

  // Iterate over each player name in the 'players' array
  for (const playerName of players) {
    const formattedPlayerName = playerName.toUpperCase();
    // Retrieve the user ID from the map based on the player name
    const userID = userMap.get(formattedPlayerName);

    // Check if a user ID was found for the current player
    if (userID) {
      userIDs.push(userID);
    } else {
      const existingGuest = await Guest.findOne({
        where: {
          userName: playerName,
        },
      });

      if (existingGuest) {
        userIDs.push(existingGuest.id);
      } else if (!existingGuest) {
        const createdGuest = await Guest.create({
          userName: playerName,
        });
        userIDs.push(createdGuest.id);
      }
    }
  }
  return userIDs;
}

// Check if any of the players are already in the queue or playing
async function checkPlayersInQueueOrPlaying(userIDs) {
  const playersInQueueOrPlaying = await Queue.findOne({
    where: {
      playerId: userIDs,
      status: { [Op.in]: ["PENDING", "PLAYING"] },
    },
  });

  if (playersInQueueOrPlaying) {
    throw new Error(
      `Player(s) with id ${userIDs.join(" or ")} is already ${
        playersInQueueOrPlaying.status
      }`
    );
  }
}

async function checkPlayersInTeams(userIDs, formattedGameType) {
  // Check if any of the players are already in a team with a different game type
  const playersInTeamWithDifferentGameType = await Team.findOne({
    where: {
      [Op.or]: [
        { player1Id: userIDs, gameType: { [Op.not]: formattedGameType } },
        { player2Id: userIDs, gameType: { [Op.not]: formattedGameType } },
      ],
    },
  });

  if (playersInTeamWithDifferentGameType) {
    throw new Error(
      `Player(s) with id ${userIDs.join(
        " or "
      )} is already in a team with a different gameType (${
        playersInTeamWithDifferentGameType.gameType
      })`
    );
  }
}

async function updateTablesWithPlayerID(userIDs, team) {
  // Update playerId in User or Guest table for all players
  for (const userId of userIDs) {
    try {
      const isGuest = await Guest.findOne({ where: { id: userId } });

      if (isGuest) {
        // If it's a guest, update playerId in Guest table
        await Guest.update(
          { playerId: team.id },
          {
            where: {
              id: userId,
            },
          }
        );
      } else {
        // If it's a user, update playerId in User table
        await User.update(
          { playerId: team.id },
          {
            where: {
              id: userId,
            },
          }
        );
      }
    } catch (error) {
      throw new Error("Something went wrong while updating the playerId");
    }
  }
}

async function fetchTeamDetails(teamId) {
  const team = await Team.findOne({
    where: {
      id: teamId,
    },
    include: [
      {
        model: User,
        as: "Player1",
        attributes: ["userName"],
        foreignKey: "player1Id",
      },
      {
        model: User,
        as: "Player2",
        attributes: ["userName"],
        foreignKey: "player2Id",
      },
    ],
  });

  if (!team) {
    return res.status(404).json({
      status: "error",
      message: `Team with id ${teamId} not found`,
    });
  }
}

module.exports = {
  validateGameType,
  validatePlayerNames,
  findUserIDs,
  checkPlayersInTeams,
  checkPlayersInQueueOrPlaying,
  updateTablesWithPlayerID,
  fetchTeamDetails,
};
