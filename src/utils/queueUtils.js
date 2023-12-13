const { Queue, Team } = require("../model");

/**
 * Gets all teams currently in the pending queue.
 *
 * @returns {Promise<import('../model/Queue')[]>} A Promise that resolves to an array of teams in the pending queue.
 */
async function getAllTeamsInQueue() {
  // Query the database to find all teams in the pending queue, ordered by timestamp in ascending order.
  const teams = await Queue.findAll({
    where: {
      status: "PENDING",
    },
    order: [["timestamp", "ASC"]],
  });

  // Return the array of teams.
  return teams;
}

/**
 * Gets the queue for a specific court.
 *
 * @param {number} courtId - The ID of the court for which to retrieve the queue.
 * @returns {Promise<import('../model/Queue')[]>} A Promise that resolves to an array representing the queue for the specified court.
 */
async function getQueueForSpecificCourt(courtId) {
  // Query the database to find the queue for the specified court, ordered by timestamp in ascending order.
  const queue = await Queue.findAll({
    where: {
      courtId,
    },
    order: [["timestamp", "ASC"]],
  });

  // Return the array representing the queue for the specified court.
  return queue;
}

/**
 * Deletes a team from the queue by its ID.
 *
 * @param {number} teamId - The ID of the team to be deleted from the queue.
 * @returns {Promise<boolean>} A Promise that resolves to true if the team is deleted, or false if the team is not found.
 */
async function deleteTeamFromQueueById(teamId) {
  console.log("teamId: ", teamId);
  // Query the database to find the team in the queue by its ID.
  const teamEntryOnQueue = await Queue.findOne({
    where: {
      id: teamId,
    },
  });

  const playerId = teamEntryOnQueue.playerId;
  console.log("playerId: ", playerId);

  const teamEntryOnTeam = await Team.findOne({
    where: {
      playerId: playerId,
    },
  });

  if (teamEntryOnTeam) {
    await teamEntryOnTeam.destroy();
  }

  // If the team is found in the queue, destroy it and return true.
  if (teamEntryOnQueue) {
    await teamEntryOnQueue.destroy();
    return true;
  }

  // If the team is not found in either the queue or the Team model, return false.
  return false;
}

module.exports = {
  getAllTeamsInQueue,
  getQueueForSpecificCourt,
  deleteTeamFromQueueById,
};
