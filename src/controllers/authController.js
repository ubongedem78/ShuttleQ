const {
  registerUser,
  loginUser,
  logoutUser,
  createGuestUser,
  loginUserAsGuest,
} = require("../utils/authUtils");

// Create User
const register = async (req, res, next) => {
  try {
    const { email, userName, avatar, password, role } = req.body;

    const user = await registerUser(email, userName, avatar, password, role);

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

    const user = await loginUser(userName, password);

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
    await logoutUser(req);

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

// Create Guest
const createGuest = async (req, res, next) => {
  try {
    const { guestName, avatar } = req.body;

    const guest = await createGuestUser(guestName, avatar);

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

    const guest = await loginUserAsGuest(guestName);

    const token = guest.createJWT();

    req.session.token = token;
    req.session.user = guest;
    return res.json({ guest, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, createGuest, loginGuest };
