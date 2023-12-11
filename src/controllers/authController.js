const { User, Team } = require("../model");
const jwt = require("jsonwebtoken");

// Create User
const register = async (req, res) => {
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
    const token = user.createJWT();
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Error in creating user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password)
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });

    const user = await User.findOne({ where: { userName: userName } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = user.createJWT();

    return res.json({ user, token });
  } catch (error) {
    console.error("Error in logging in user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
