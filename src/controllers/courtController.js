const {
  findCourtByName,
  createNewCourt,
  getAllCourts,
  updateCourtById,
  deleteCourtById,
} = require("../utils/courtUtils");

const { BadRequestError, NotFoundError } = require("../errors");

// Create a new court and associate it with a Queue
const createCourt = async (req, res, next) => {
  try {
    const { courtName, courtType } = req.body;

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

// update a court
const updateCourt = async (req, res, next) => {
  try {
    const { courtId } = req.params;
    const { courtName, courtType } = req.body;

    const court = await updateCourtById(courtId, { courtName, courtType });

    res.status(200).json({
      status: "success",
      data: { court },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a court
const deleteCourt = async (req, res, next) => {
  try {
    const { courtId } = req.params;

    const court = await deleteCourtById(courtId);

    res.status(200).json({
      status: "success",
      message: "Court deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCourt, getCourts, updateCourt, deleteCourt };
