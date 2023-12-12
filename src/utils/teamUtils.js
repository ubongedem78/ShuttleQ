const { Team, User, Queue, Court, Guest } = require("../model");
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
  console.log("userMap", userMap);

  // Iterate over each player name in the 'players' array
  for (const playerName of players) {
    const formattedPlayerName = playerName.toUpperCase();
    // Retrieve the user ID from the map based on the player name
    const userID = userMap.get(formattedPlayerName);

    // Check if a user ID was found for the current player
    if (userID) {
      console.log("I found a userID");
      userIDs.push(userID);
    } else {
      const existingGuest = await Guest.findOne({
        where: {
          userName: playerName,
        },
      });

      if (existingGuest) {
        console.log("i found an existing guest");
        userIDs.push(existingGuest.id);
        console.log("I have pushed the existing guest ID");
      } else if (!existingGuest) {
        console.log("I am using a created guest");
        const createdGuest = await Guest.create({
          userName: playerName,
        });
        userIDs.push(createdGuest.id);
      }
    }
  }
  return userIDs;
}

module.exports = {
  validateGameType,
  validatePlayerNames,
  findUserIDs,
};
