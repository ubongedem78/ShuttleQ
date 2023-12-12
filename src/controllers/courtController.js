const { Court } = require("../model");
const {
  findCourtByName,
  createNewCourt,
  getAllCourts,
} = require("../utils/courtUtils");

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../errors");

// Create a new court and associate it with a Queue
const createCourt = async (req, res) => {
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
    throw new InternalServerError(error.message);
  }
};

// Get all courts
const getCourts = async (req, res) => {
  try {
    const courts = await getAllCourts();

    res.status(200).json({
      status: "success",
      data: courts,
    });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

// Delete a court
const deleteCourt = async (req, res) => {
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
    throw new InternalServerError(error.message);
  }
};

module.exports = { createCourt, getCourts, deleteCourt };
