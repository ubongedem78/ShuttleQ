const { Queue } = require("../model");

//Get all teams on the queue

const getQueue = async (req, res) => {
  try {
    const queue = await Queue.findAll({
      where: {
        status: "PENDING",
      },
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      data: queue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete a team from the queue
const deleteTeamFromQueue = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Queue.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return res.status(404).json({
        status: "error",
        message: "Team not found",
      });
    }

    await team.destroy();

    res.status(200).json({
      status: "success",
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { getQueue, deleteTeamFromQueue };
