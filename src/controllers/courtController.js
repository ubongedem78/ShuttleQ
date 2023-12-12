const { Court } = require("../model");
const {
  findCourtByName,
  createNewCourt,
  getAllCourts,
} = require("../utils/courtUtils");

const {
  BadRequestError,
  NotFoundError,
} = require("../errors");

// Create a new court and associate it with a Queue
const createCourt = async (req, res, next) => {
  try {
    const { courtName, courtType } = req.body;

    if (!courtName || !courtType) {
      throw new BadRequestError("Invalid courtName or courtType");
    }

    const existingCourt = await findCourtByName(courtName);

    if (existingCourt) {
      throw new BadRequestError("Court already exists");
    }

    // Create the Court
    const court = await createNewCourt(courtName, courtType);

    res.status(201).json({
      status: "success",
      data: { court },
    });
  } catch (error) {
    next(error);
  }
};

// Get all courts
const getCourts = async (req, res, next) => {
  try {
    const courts = await getAllCourts();

    res.status(200).json({
      status: "success",
      data: courts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a court
const deleteCourt = async (req, res, next) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findOne({
      where: {
        courtId,
      },
    });

    if (!court) {
      throw new NotFoundError("Court not found");
    }

    await court.destroy();

    res.status(200).json({
      status: "success",
      message: "Court deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCourt, getCourts, deleteCourt };
