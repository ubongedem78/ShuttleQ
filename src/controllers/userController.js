const {
  fetchAllUsers,
  fetchAllUsersById,
  updateUserDetails,
  deleteUserById,
} = require("../utils/userUtils");

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();

    return res.json({ users });
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    next(error);
  }
};

// Get User By Id
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await fetchAllUsersById(userId);

    return res.json({ user });
  } catch (error) {
    console.error("Error in fetching single user: ", error);
    next(error);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    //update either user or guest
    const userOrGuestId = req.params.id;
    const userData = req.body;

    const user = await updateUserDetails(userOrGuestId, userData);

    return res.json({ user });
  } catch (error) {
    console.error("Error in updating user: ", error);
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await deleteUserById(userId);

    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
