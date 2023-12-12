const { User, Team, Guest } = require("../model");
const { NotFoundError, InternalServerError } = require("../errors");

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
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

      return res.json({ guest });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in fetching single user: ", error);
    next(error);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, userName, avatar, password, role } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found");
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
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.destroy();

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
