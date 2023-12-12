const { Court } = require("../model");

/**
 * Finds a court by its name.
 *
 * @param {string} courtName - The name of the court to search for.
 * @returns {Promise<import('../model/Court') | null>} A Promise that resolves to the found court or null if not found.
 */
async function findCourtByName(courtName) {
  const existingCourt = await Court.findOne({
    where: {
      courtName,
    },
  });
  return existingCourt;
}

/**
 * Creates a new court.
 *
 * @param {string} courtName - The name of the new court.
 * @param {string} courtType - The type of the new court.
 * @returns {Promise<import('../model/Court')>} A Promise that resolves to the newly created court.
 */
async function createNewCourt(courtName, courtType) {
  const court = await Court.create({
    courtName,
    courtType,
  });
  return court;
}

/**
 * Gets all courts.
 *
 * @returns {Promise<import('../model/Court')[]>} A Promise that resolves to an array of all courts.
 */
async function getAllCourts() {
  const courts = await Court.findAll();
  return courts;
}

module.exports = {
  findCourtByName,
  createNewCourt,
  getAllCourts,
};
