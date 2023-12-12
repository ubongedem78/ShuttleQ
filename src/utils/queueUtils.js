const { Queue } = require("../model");

/**
 * Gets all teams currently in the pending queue.
 *
 * @returns {Promise<import('../model/Queue')[]>} A Promise that resolves to an array of teams in the pending queue.
 */
async function getAllTeamsInQueue() {
  const teams = await Queue.findAll({
    where: {
      status: "PENDING",
    },
    order: [["timestamp", "ASC"]],
  });
  return teams;
}

/**
 * Gets the queue for a specific court.
 *
 * @param {number} courtId - The ID of the court for which to retrieve the queue.
 * @returns {Promise<import('../model/Queue')[]>} A Promise that resolves to an array representing the queue for the specified court.
 */
async function getQueueForSpecificCourt(courtId) {
  const queue = await Queue.findAll({
    where: {
      courtId,
    },
    order: [["timestamp", "ASC"]],
  });
  return queue;
}

/**
 * Deletes a team from the queue by its ID.
 *
 * @param {number} teamId - The ID of the team to be deleted from the queue.
 * @returns {Promise<boolean>} A Promise that resolves to true if the team is deleted, or false if the team is not found.
 */
async function deleteTeamFromQueueById(teamId) {
  const team = await Queue.findOne({
    where: {
      id: teamId,
    },
  });

  if (team) {
    await team.destroy();
    return true;
  }

  return false;
}

module.exports = {
  getAllTeamsInQueue,
  getQueueForSpecificCourt,
  deleteTeamFromQueueById,
};
