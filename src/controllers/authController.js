const { User, Guest } = require("../model");

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
    req.session.user = user;
    req.session.token = token;
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
    req.session.user = user;
    console.log("req.session.user", req.session.user);
    req.session.token = token;
    console.log("req.session.token", req.session.token);
    return res.json({ user, token });
  } catch (error) {
    console.error("Error in logging in user: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// logout User
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {}
};

// Create Guest
const createGuest = async (req, res) => {
  try {
    const { guestName, avatar } = req.body;

    if (!guestName) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const existingGuest = await Guest.findOne({
      where: { userName: guestName },
    });

    if (existingGuest) {
      return res.status(400).json({ error: "Guest already exists" });
    }

    const guest = await Guest.create({
      userName: guestName,
      avatar,
    });
    const token = guest.createJWT();
    req.session.user = guest;
    req.session.token = token;
    return res.status(201).json({ guest, token });
  } catch (error) {
    console.error("Error in creating guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, logout, createGuest };
