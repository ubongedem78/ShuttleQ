const { User } = require("../model");

//Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    return res.status(500).json({ error: error.message });
  }
};

//Get User By Id
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Error in fetching single user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

//Create User
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error in creating user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

//Update User
const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update(req.body);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in updating user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

//Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    return res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleting user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
