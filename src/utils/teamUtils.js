const { User, Queue, Court, Guest } = require("../model");
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

async function findOrCreateGuest(playerName) {
  const [existingGuest, created] = await Guest.findOrCreate({
    where: {
      userName: playerName,
    },
  });

  return existingGuest || (created ? existingGuest : null);
}

async function updateUserOrGuestIds(players) {
  const userIDs = [];

  for (const playerName of players) {
    const formattedPlayerName = playerName.toUpperCase();

    const user = await User.findOne({
      where: {
        userName: {
          [Op.iLike]: `%${formattedPlayerName}`,
        },
      },
    });

    if (user) {
      userIDs.push(user.id);
    } else {
      const guest = await findOrCreateGuest(playerName);

      if (guest) {
        userIDs.push(guest.id);
      }
    }
  }

  return userIDs;
}

async function updatePlayerIdInTables(userIDs, teamId) {
  for (const userId of userIDs) {
    try {
      const isGuest = await Guest.findOne({ where: { id: userId } });

      if (isGuest) {
        await Guest.update(
          { playerId: teamId },
          {
            where: {
              id: userId,
            },
          }
        );
      } else {
        await User.update(
          { playerId: teamId },
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

async function checkQueueAndPlayingStatus(userIDs, formattedGameType, courtId) {
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
    throw new Error(
      `Player(s) are already in the queue with a different gameType (${playersInQueueWithDifferentGameType.gameType}). Please wait until they finish playing.`
    );
  }

  const teamInQueue = await Queue.findOne({
    where: {
      [Op.or]: [
        { teamId: teamId, status: { [Op.in]: ["PENDING", "PLAYING"] } },
        { playerId: userIDs, status: { [Op.in]: ["PENDING", "PLAYING"] } },
      ],
      courtId,
    },
  });

  if (teamInQueue) {
    const teamMessage =
      teamInQueue.teamId === teamId
        ? `Team with id ${teamId} is already in the queue`
        : `Player(s) with id ${userIDs.join(" or ")} is already in the queue`;

    throw new Error(teamMessage);
  }

  const teamPlaying = await Queue.findOne({
    where: {
      [Op.or]: [
        { teamId: teamId, status: "PLAYING" },
        { playerId: userIDs, status: "PLAYING" },
      ],
      courtId,
    },
  });

  if (teamPlaying) {
    const teamMessage =
      teamPlaying.teamId === teamId
        ? `Team with id ${teamId} is already playing`
        : `Player(s) with id ${userIDs.join(" or ")} is already playing`;

    throw new Error(teamMessage);
  }
}

module.exports = {
  validateGameType,
  validatePlayerNames,
  findOrCreateGuest,
  updateUserOrGuestIds,
  updatePlayerIdInTables,
  checkQueueAndPlayingStatus,
};
