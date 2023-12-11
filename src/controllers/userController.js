const { User, Team, Guest } = require("../model");

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
      const guest = await Guest.findByPk(userId, {
        include: [{ model: Team, as: "GuestTeam" }],
      });

      if (!guest) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ guest });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in fetching single user: ", error);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
