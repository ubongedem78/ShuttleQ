const {
  getAllTeamsInQueue,
  getQueueForSpecificCourt,
  deleteTeamFromQueueById,
} = require("../utils/queueUtils");

// Get all teams on the queue
const getQueue = async (req, res, next) => {
  try {
    const queue = await getAllTeamsInQueue();

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.error("Error in getQueue: ", error);
    next(error);
  }
};

// Get the queue for a specific court
const getQueueForCourt = async (req, res, next) => {
  try {
    const { courtId } = req.params;

    const queue = await getQueueForSpecificCourt(courtId);

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.error("Error in getQueueForCourt: ", error);
    next(error);
  }
};

// Delete a team from the queue
const deleteTeamFromQueue = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    await deleteTeamFromQueueById(teamId);

    res.status(200).json({
      status: "success",
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteTeamFromQueue: ", error);
    next(error);
  }
};

module.exports = { getQueue, getQueueForCourt, deleteTeamFromQueue };
