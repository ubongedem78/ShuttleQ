const { User, Team } = require("../model");

/**
 * Gets all guests.
 *
 * @returns {Promise<import('../model/User')[]>} A Promise that resolves to an array of all guests.
 */
async function getAllGuests() {
  const guests = await User.findAll();
  return guests;
}

/**
 * Finds a guest by their ID, including associated team information.
 *
 * @param {number} guestId - The ID of the guest to search for.
 * @returns {Promise<import('../model/User') | null>} A Promise that resolves to the found guest or null if not found.
 */
async function findGuestById(guestId) {
  const guest = await User.findByPk(guestId, {
    include: [{ model: Team, as: "PlayerTeam" }],
  });
  return guest;
}

/**
 * Updates the details of a guest.
 *
 * @param {number} guestId - The ID of the guest to update.
 * @param {string} guestName - The new name for the guest.
 * @returns {Promise<import('../model/User') | null>} A Promise that resolves to the updated guest or null if not found.
 */
async function updateGuestDetails(guestId, guestName) {
  const guest = await User.findByPk(guestId);
  if (guest) {
    await User.update({ userName: guestName }, { where: { id: guestId } });

    // Retrieve the updated guest with associated team information
    const updatedGuest = await findGuestById(guestId);
    return updatedGuest;
  }
  return null;
}

/**
 * Deletes a guest by their ID.
 *
 * @param {number} guestId - The ID of the guest to delete.
 * @returns {Promise<boolean>} A Promise that resolves to true if the guest is deleted, or false if the guest is not found.
 */
async function deleteGuestById(guestId) {
  const guest = await User.findByPk(guestId);
  if (guest) {
    await guest.destroy();
    return true;
  }
  return false;
}

module.exports = {
  getAllGuests,
  findGuestById,
  updateGuestDetails,
  deleteGuestById,
};
