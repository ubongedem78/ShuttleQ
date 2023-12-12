const { User, Guest } = require("../model");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../errors");

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

    if (!userName || !password) {
      throw new BadRequestError("Please provide all required fields");
    }

    const user = await User.findOne({ where: { userName: formattedUserName } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await user.comparePassword(password);

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

    const existingGuest = await Guest.findOne({
      where: { userName: formattedGuestName },
    });

    if (existingGuest) {
      throw new BadRequestError("Guest already exists");
    }

    const guest = await Guest.create({
      userName: formattedGuestName,
      avatar,
    });
    const token = guest.createJWT();
    req.session.user = guest;
    req.session.token = token;
    return res.status(201).json({ guest, token });
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

    const guest = await Guest.findOne({
      where: { userName: formattedGuestName },
    });

    if (!guest) {
      throw new NotFoundError("Guest not found");
    }

    const token = guest.createJWT();
    req.session.user = guest;
    req.session.token = token;
    return res.json({ guest, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, createGuest, loginGuest };
