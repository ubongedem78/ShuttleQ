const { Team, User, Queue, Guest, Court } = require("../model");
const { Op } = require("sequelize");

/**
 * Validates the game type and converts it to uppercase.
 *
 * @param {string} gameType - The game type to validate.
 * @returns {Promise<string>} A Promise that resolves to the formatted and validated game type.
 * @throws {Error} If the game type is invalid.
 */
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

/**
 * Validates player names based on the game type.
 *
 * @param {string} playerNames - A comma-separated string of player names.
 * @param {string} formattedGameType - The formatted and validated game type.
 * @returns {Promise<string[]>} A Promise that resolves to an array of validated player names.
 * @throws {Error} If player names or game type is invalid.
 */
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

/**
 * Finds user IDs based on player names.
 *
 * @param {string[]} players - An array of validated player names.
 * @returns {Promise<number[]>} A Promise that resolves to an array of user IDs.
 */
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
      console.log("There is a userID")
      userIDs.push(userID);
      console.log("Ihave pushed")
    } else {
      console.log("There is no userID")
      const existingGuest = await Guest.findOne({
        where: {
          userName: playerName,
        },
      });

      if (existingGuest) {
        console.log("There is an existing guest")
        userIDs.push(existingGuest.id);
      } else if (!existingGuest) {
        console.log("There is no existing guest")
        const createdGuest = await Guest.create({
          userName: playerName,
        });
        userIDs.push(createdGuest.id);
        console.log("I have pushed guestID to userID")
      }
    }
  }
  console.log("I am here 6")
  return userIDs;
}

/**
 * Checks if players with the specified user IDs are already in a queue or playing a game.
 *
 * @param {number[]} userIDs - An array of user IDs to check for queue or playing status.
 * @throws {Error} If any player in the provided user IDs is already in a queue or playing a game.
 */
async function checkPlayersInQueueOrPlaying(userIDs) {
  // Query the database to find a queue entry where any of the specified user IDs is a player,
  // and the status is "PENDING" or "PLAYING".
  const playersInQueueOrPlaying = await Queue.findOne({
    where: {
      playerId: userIDs,
      status: { [Op.in]: ["PENDING", "PLAYING"] },
    },
  });

  // If players in a queue or playing are found, throw an error.
  if (playersInQueueOrPlaying) {
    throw new Error(
      `Player(s) with id ${userIDs.join(" or ")} is already ${
        playersInQueueOrPlaying.status
      }`
    );
  }
}

/**
 * Checks if players are already in teams with a different game type.
 *
 * @param {number[]} userIDs - An array of user IDs.
 * @param {string} formattedGameType - The formatted and validated game type.
 * @throws {Error} If any player is already in a team with a different game type.
 */
async function checkPlayersInTeams(userIDs, formattedGameType) {
  // Query the database to find a team where any of the specified user IDs is a player, and the game type is not the same as the specified formatted game type.
  const playersInTeamWithDifferentGameType = await Team.findOne({
    where: {
      [Op.or]: [
        { player1Id: userIDs, gameType: { [Op.not]: formattedGameType } },
        { player2Id: userIDs, gameType: { [Op.not]: formattedGameType } },
      ],
    },
  });

  // If players with different game types are found in a team, throw an error.
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

/**
 * Updates tables with player ID based on user IDs and team information.
 *
 * @param {number[]} userIDs - An array of user IDs.
 * @param {import('../model/Team')} team - The team information.
 * @throws {Error} If something goes wrong during the update.
 */
async function updateTablesWithPlayerID(userIDs, team) {
  console.log("I am here 5")
  for (const userId of userIDs) {
    try {
      const isGuest = await Guest.findOne({ where: { id: userId } });

      if (isGuest) {
        await Guest.update(
          { playerId: team.id },
          {
            where: {
              id: userId,
            },
          }
        );
      } else {
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

/**
 * Fetches team details based on the team ID.
 *
 * @param {number} teamId - The ID of the team to fetch details for.
 * @returns {Promise<void>} A Promise that resolves when the team details are fetched.
 * @throws {Error} If the team is not found.
 */
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

  // If the team is not found, throw an error indicating that the team with the specified ID was not found.
  if (!team) {
    throw new Error(`Team with id ${teamId} not found`);
  }
}

/**
 * Checks if the specified court is currently occupied with games of a certain type.
 * @param {number} courtId - The ID of the court to check.
 * @param {string} formattedGameType - The formatted type of the game to check for.
 * @throws {Error} Throws an error if the court is occupied with a different game type.
 * @returns {Promise<void>} A Promise that resolves if the court is available for the specified game type.
 */
async function typeOfGamesOnCourt(courtId, formattedGameType) {
  // Query the database to find any games on the specified court that are in "PENDING" or "PLAYING" status.
  const gamesOnCourt = await Queue.findOne({
    where: {
      courtId,
      status: { [Op.in]: ["PENDING", "PLAYING"] },
    },
  });

  // Query the database to find information about the court using its ID.
  const courtName = await Court.findOne({
    where: {
      courtId: courtId,
    },
  });

  // If there are games on the court, check if their game type matches the specified formatted game type.
  if (gamesOnCourt) {
    const gameType = gamesOnCourt.gameType;
    if (gameType !== formattedGameType) {
      // Throw an error if the game type doesn't match, indicating that the court is being used for a different type of game.
      throw new Error(
        `Court ${courtName.courtName} is being used for ${gameType} games.`
      );
    }
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
  typeOfGamesOnCourt,
};
