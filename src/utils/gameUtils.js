const { Queue, Team } = require("../model");

async function updateQueueAndTeams(queuePairs) {
  await Promise.all([
    Queue.update(
      { status: "PLAYING" },
      { where: { id: queuePairs.map((pair) => pair.id) } }
    ),
    Team.update(
      { isActive: true },
      { where: { id: queuePairs.map((pair) => pair.teamId) } }
    ),
  ]);
}

module.exports = { updateQueueAndTeams };
