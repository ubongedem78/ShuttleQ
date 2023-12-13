const { Team, Queue } = require("../model");

/**
 * Ends the current session on a specified court by removing teams from the queue
 * and destroying the corresponding team records.
 *
 * @param {number} courtId - The ID of the court for which to end the session.
 * @throws {NotFoundError} If no teams are found in the queue or associated with the court.
 */
async function endCurrentCourtSession(courtId) {
  // Find all teams in the queue associated with the specified court.
  const queue = await Queue.findAll({ where: { courtId: courtId } });

  // If no teams are found in the queue, throw a NotFoundError.
  if (queue.length === 0) {
    throw new NotFoundError("No teams in queue");
  }

  // Extract the IDs of teams in the queue.
  const queueIds = queue.map((team) => team.id);

  // Destroy the queue entries for the found teams.
  await Queue.destroy({ where: { id: queueIds } });

  // Find all teams associated with the specified court.
  const team = await Team.findAll({ where: { courtId: courtId } });

  // If no teams are found, throw a NotFoundError.
  if (team.length === 0) {
    throw new NotFoundError("No teams associated with the court");
  }

  // Extract the IDs of teams associated with the court.
  const teamIds = team.map((team) => team.id);

  // Destroy the team records associated with the found teams.
  await Team.destroy({ where: { id: teamIds } });
}

module.exports = { endCurrentCourtSession };
