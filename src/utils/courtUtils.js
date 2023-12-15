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

/**
 * Updates a court.
 *
 * @param {number} courtId - The ID of the court to update.
 * @param {string} courtName - The new name of the court.
 * @param {string} courtType - The new type of the court.
 * @returns {Promise<import('../model/Court')>} A Promise that resolves to the updated court.
 * @throws {Error} If the court is not found.
 * @throws {Error} If the court name is already taken.
 * @throws {Error} If the court type is invalid.
 */
async function updateCourtById(courtId, { courtName, courtType }) {
  if (!courtName) {
    throw new Error("Court name is required");
  }

  if (!courtType) {
    throw new Error("Court type is required");
  }

  if (!["ADVANCED", "INTERMEDIATE", "BEGINNERS"].includes(courtType)) {
    throw new Error("Invalid court type");
  }

  const court = await Court.findOne({
    where: {
      courtId,
    },
  });

  if (!court) {
    throw new Error("Court not found");
  }

  await court.update({
    courtName,
    courtType,
  });

  return court;
}

/**
 * Deletes a court.
 *
 * @param {number} courtId - The ID of the court to delete.
 * @returns {Promise<void>} A Promise that resolves when the court is deleted.
 * @throws {Error} If the court is not found.
 */
async function deleteCourtById(courtId) {
  if (!courtId) {
    throw new Error("Court Id is required");
  }

  const court = await Court.findOne({
    where: {
      courtId,
    },
  });

  if (!court) {
    throw new Error("Court not found");
  }

  await court.destroy();
}

module.exports = {
  findCourtByName,
  createNewCourt,
  getAllCourts,
  updateCourtById,
  deleteCourtById,
};
