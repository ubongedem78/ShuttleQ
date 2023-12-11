const { Queue } = require("../model");

async function getAllTeamsInQueue() {
  const teams = await Queue.findAll({
    where: {
      status: "PENDING",
    },
    order: [["timestamp", "ASC"]],
  });
  return teams;
}

async function getQueueForSpecificCourt(courtId) {
  const queue = await Queue.findAll({
    where: {
      courtId,
    },
    order: [["timestamp", "ASC"]],
  });
  return queue;
}

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
