const { User } = require("../model");
const { BadRequestError, NotFoundError } = require("../errors");

// Create User
const register = async (req, res, next) => {
  try {
    const { email, userName, avatar, password, role } = req.body;
    const formattedUserName = userName.toLowerCase();

    if (!email || !userName || !password) {
      throw new BadRequestError("Please provide all required fields");
    }

    const existingUser = await User.findOne({
      where: { email: email, userName: formattedUserName },
    });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const user = await User.create({
      email,
      avatar,
      userName: formattedUserName,
      passwordHash: password,
      role,
    });
    const token = user.createJWT();
    req.session.user = user;
    req.session.token = token;
    return res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const formattedUserName = userName.toLowerCase();
    console.log(formattedUserName);

    if (!userName || !password) {
      throw new BadRequestError("Please provide all required fields");
    }

    const user = await User.findOne({ where: { userName: formattedUserName } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = user.createJWT();
    req.session.user = user;
    req.session.token = token;
    return res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Logout User
const logout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

// Create Guest
const createGuest = async (req, res, next) => {
  try {
    const { guestName, avatar } = req.body;
    const formattedGuestName = guestName.toLowerCase();

    if (!guestName) {
      throw new BadRequestError("Please provide all required fields");
    }

    const existingGuest = await User.findOne({
      where: { userName: formattedGuestName },
    });

    if (existingGuest && existingGuest.isGuest) {
      throw new BadRequestError("Guest already exists");
    }

    const guest = await User.create({
      userName: formattedGuestName,
      avatar,
      isGuest: true,
    });
    req.session.user = guest;
    return res.status(201).json({ guest });
  } catch (error) {
    next(error);
  }
};

const loginGuest = async (req, res, next) => {
  try {
    const { guestName } = req.body;
    const formattedGuestName = guestName.toLowerCase();

    if (!guestName) {
      throw new BadRequestError("Please provide all required fields");
    }

    const guest = await User.findOne({
      where: { userName: formattedGuestName },
    });

    if (!guest) {
      throw new NotFoundError("Guest not found");
    }

    req.session.user = guest;
    return res.json({ guest });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, createGuest, loginGuest };
