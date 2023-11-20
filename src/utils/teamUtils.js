const { Queue, User, Court } = require("../model");
const { Op } = require("sequelize");

function validateInput(gameType, playerNames) {
  const formattedGameType = gameType && gameType.toUpperCase();
  if (
    !formattedGameType ||
    !["SINGLES", "DOUBLES"].includes(formattedGameType)
  ) {
    return { error: "Invalid gameType" };
  }

  if (typeof playerNames !== "string") {
    return { error: "Player Names must be a string" };
  }

  return {};
}

function validateNumberOfPlayers(formattedGameType, players) {
  const numberOfPlayers = players.length;

  switch (formattedGameType) {
    case "DOUBLES":
      if (numberOfPlayers !== 2) {
        return { error: "For DOUBLES, you must provide exactly 2 players" };
      }
      break;
    case "SINGLES":
      if (numberOfPlayers !== 1) {
        return { error: "For SINGLES, you must provide exactly 1 player" };
      }
      break;
    default:
      return { error: "Invalid gameType" };
  }

  return {};
}

async function getUserIDs(players) {
  const users = await User.findAll({ where: { firstName: players } });

  // Here I will create a map that associates user first names with their IDs
  const userMap = new Map(users.map((user) => [user.firstName, user.id]));

  const userIDs = players.map((playerName) => {
    const userID = userMap.get(playerName);
    if (!userID) {
      throw {
        status: "error",
        message: `Player with name ${playerName} does not exist`,
      };
    }
    return userID;
  });

  return userIDs;
}

async function validateQueueStatus(team, userIDs, formattedGameType, courtId) {
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
    return {
      error: `Player(s) are already in the queue with a different gameType (${playersInQueueWithDifferentGameType.gameType}). Please wait until they finish playing.`,
    };
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

    return {
      error: teamMessage,
    };
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

    return {
      error: teamMessage,
    };
  }
  return {};
}

module.exports = {
  validateInput,
  validateNumberOfPlayers,
  getUserIDs,
  validateQueueStatus,
};
