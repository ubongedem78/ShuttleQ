const { User, Team, Guest } = require("../model");
const { NotFoundError } = require("../errors");

/**
 * Fetches all users from the database.
 *
 * @returns {Promise<import('../model/User')[]>} A Promise that resolves to an array of all users.
 */
async function fetchAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error in fetchAllUsers: ", error);
  }
}

/**
 * Fetches user details by user ID, including associated teams if any.
 *
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<import('../model/User'|'Guest')>} A Promise that resolves to the user or guest details.
 * @throws {NotFoundError} If the user or guest is not found.
 */
async function fetchAllUsersById(userId) {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Team, as: "PlayerTeam" }],
    });

    if (!user) {
      const guest = await Guest.findByPk(userId, {
        include: [{ model: Team, as: "GuestTeam" }],
      });

      if (!guest) {
        throw new NotFoundError("User not found");
      }

      return guest;
    }

    return user;
  } catch (error) {
    console.error("Error in fetchAllUsersById: ", error);
  }
}

/**
 * Updates user details by user ID.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {object} userData - The data to update for the user.
 * @returns {Promise<import('../model/User'|'Guest')>} A Promise that resolves to the updated user or guest details.
 * @throws {NotFoundError} If the user or guest is not found.
 */
async function updateUserDetails(userId, userData) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      const guest = await Guest.findByPk(userId);

      if (!guest) {
        throw new NotFoundError("User not found");
      }

      userData.userName = userData.userName.toLowerCase();

      await guest.update(userData);
      return guest;
    }

    userData.userName = userData.userName.toLowerCase();

    await user.update(userData);
    return user;
  } catch (error) {
    console.error("Error in updateUserDetails: ", error);
  }
}

/**
 * Deletes a user by user ID.
 *
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<boolean>} A Promise that resolves to true if the user is deleted.
 * @throws {NotFoundError} If the user is not found.
 */
async function deleteUserById(userId) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.destroy();
    return true;
  } catch (error) {
    console.error("Error in deleteUserById: ", error);
  }
}

module.exports = {
  fetchAllUsers,
  fetchAllUsersById,
  updateUserDetails,
  deleteUserById,
};
