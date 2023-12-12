const {
  getAllTeamsInQueue,
  getQueueForSpecificCourt,
  deleteTeamFromQueueById,
} = require("../utils/queueUtils");

const { NotFoundError, InternalServerError } = require("../errors");

// Get all teams on the queue
const getQueue = async (req, res) => {
  try {
    const queue = await getAllTeamsInQueue();

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.error("Error in getQueue: ", error);
    throw new InternalServerError(error.message);
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
    console.error("Error in getQueueForCourt: ", error);
    throw new InternalServerError(error.message);
  }
};

// Delete a team from the queue
const deleteTeamFromQueue = async (req, res) => {
  try {
    const { teamId } = req.params;

    const teamDeleted = await deleteTeamFromQueueById(teamId);

    if (!teamDeleted) {
      throw new NotFoundError("Team not found in the queue");
    }

    res.status(200).json({
      status: "success",
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteTeamFromQueue: ", error);
    throw new InternalServerError(error.message);
  }
};

module.exports = { getQueue, getQueueForCourt, deleteTeamFromQueue };
