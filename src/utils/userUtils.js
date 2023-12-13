const { User, Team, Guest } = require("../model");
const { NotFoundError } = require("../errors");

async function fetchAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
  }
}

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
    console.error("Error in fetching single user: ", error);
  }
}

async function updateUserDetails(userId, userData) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      const guest = await Guest.findByPk(userId);

      if (!guest) {
        throw new NotFoundError("User not found");
      }

      const userName = userData.userName.toLowerCase();
      userData.userName = userName;

      await guest.update(userData);
      return guest;
    }

    const userName = userData.userName.toLowerCase();
    userData.userName = userName;

    await user.update(userData);
    return user;
  } catch (error) {
    console.error("Error in updating user: ", error);
  }
}

async function deleteUserById(userId) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.destroy();
    return true;
  } catch (error) {
    console.error("Error in deleting user: ", error);
  }
}

module.exports = {
  fetchAllUsers,
  fetchAllUsersById,
  updateUserDetails,
  deleteUserById,
};
