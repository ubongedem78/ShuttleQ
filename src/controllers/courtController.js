const { Court, CourtQueue } = require("../model");

// Create a new court and associate it with a CourtQueue
const createCourt = async (req, res) => {
  try {
    const { courtName, courtType } = req.body;

    if (!courtName || !courtType) {
      return res.status(400).json({
        status: "error",
        message: "Invalid courtName or courtType",
      });
    }

    // Check if the court already exists
    const existingCourt = await Court.findOne({
      where: {
        courtName,
      },
    });

    if (existingCourt) {
      return res.status(400).json({
        status: "error",
        message: "Court already exists",
      });
    }

    // Create the Court
    const court = await Court.create({
      courtName,
      courtType,
    });

    console.log("Court created successfully");
    console.log(court);

    const courtQueue = await CourtQueue.create({
      courtId: court.courtId,
      queueId: court.courtId,
    });

    console.log("courtQ", courtQueue);

    res.status(201).json({
      status: "success",
      data: { court, courtQueue },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get all courts
const getCourts = async (req, res) => {
  try {
    const courts = await Court.findAll();

    res.status(200).json({
      status: "success",
      data: courts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete a court
const deleteCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findOne({
      where: {
        id: courtId,
      },
    });

    if (!court) {
      return res.status(404).json({
        status: "error",
        message: "Court not found",
      });
    }

    await court.destroy();

    // Also delete the associated CourtQueue entry
    await CourtQueue.destroy({
      where: {
        courtId: court.courtId,
        queue: court.courtId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Court deleted successfully",
    });
    console.log("Court deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createCourt, getCourts, deleteCourt };
