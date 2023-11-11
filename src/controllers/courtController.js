const e = require("express");
const { Court } = require("../model");

//Create a new court
const createCourt = async (req, res) => {
  try {
    const { courtName, courtType } = req.body;
    if (!courtName || !courtType) {
      return res.status(400).json({
        status: "error",
        message: "Invalid courtName or courtType",
      });
    }
    const court = await Court.create({
      courtName,
      courtType,
    });
    res.status(201).json({
      status: "success",
      data: court,
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

    res.status(200).json({
      status: "success",
      message: "Court deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createCourt, getCourts, deleteCourt };