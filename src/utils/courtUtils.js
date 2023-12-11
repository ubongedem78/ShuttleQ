const { Court } = require("../model");

async function findCourtByName(courtName) {
  const existingCourt = await Court.findOne({
    where: {
      courtName,
    },
  });
  return existingCourt;
}

async function createNewCourt(courtName, courtType) {
  const court = await Court.create({
    courtName,
    courtType,
  });
  return court;
}

async function getAllCourts() {
  const courts = await Court.findAll();
  return courts;
}

module.exports = {
  findCourtByName,
  createNewCourt,
  getAllCourts,
};
