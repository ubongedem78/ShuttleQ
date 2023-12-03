const { User, Team } = require("../model");

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get User By Id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [{ model: Team, as: "PlayerTeam" }],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Error in fetching single user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { email, userName, avatar, password, role } = req.body;

    if (!email || !userName || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({
      where: { email: email, userName: userName },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      email,
      avatar,
      userName,
      passwordHash: password,
      role,
    });
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error in creating user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, userName, avatar, password, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = email;
    user.userName = userName;
    user.avatar = avatar;
    user.passwordHash = password;
    user.role = role;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in updating user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(204).json({ message: "User deleted successfully" });
    console.log("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
