const { Queue } = require("../model");
const {
  getAllTeamsInQueue,
  getQueueForSpecificCourt,
  deleteTeamFromQueueById,
} = require("../utils/queueUtils");

// Get all teams on the queue
const getQueue = async (req, res) => {
  try {
    const queue = await getAllTeamsInQueue();

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the queue for a specific court
const getQueueForCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const queue = await getQueueForSpecificCourt(courtId);

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a team from the queue
const deleteTeamFromQueue = async (req, res) => {
  try {
    const { teamId } = req.params;

    const teamDeleted = await deleteTeamFromQueueById(teamId);

    if (!teamDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Team not found in the queue",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getQueue, getQueueForCourt, deleteTeamFromQueue };
