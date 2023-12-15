const { User } = require("../model");
const { BadRequestError, NotFoundError } = require("../errors");

/**
 * Registers a new user.
 *
 * @param {string} email - The email of the user.
 * @param {string} userName - The username of the user.
 * @param {string} avatar - The avatar of the user.
 * @param {string} password - The password of the user.
 * @param {string} role - The role of the user.
 * @returns {Promise<import('../model/User')>} A Promise that resolves to the created user.
 * @throws {BadRequestError} If required fields are not provided or the user already exists.
 */
async function registerUser(email, userName, avatar, password, role) {
  const formattedUserName = userName.toLowerCase();

  if (!email || !formattedUserName || !password) {
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

  return user;
}

/**
 * Logs in a user.
 *
 * @param {string} userName - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<import('../model/User')>} A Promise that resolves to the logged-in user.
 * @throws {BadRequestError} If required fields are not provided.
 * @throws {NotFoundError} If the user is not found or the credentials are invalid.
 */
async function loginUser(userName, password) {
  const formattedUserName = userName.toLowerCase();

  if (!formattedUserName || !password) {
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

  return user;
}

/**
 * Logs out a user by destroying the session.
 *
 * @param {Object} req - The request object containing the session.
 */
async function logoutUser(req) {
  req.session.destroy();
}

/**
 * Creates a new guest user.
 *
 * @param {string} guestName - The name of the guest user.
 * @param {string} avatar - The avatar of the guest user.
 * @returns {Promise<import('../model/User')>} A Promise that resolves to the created guest user.
 * @throws {BadRequestError} If required fields are not provided or the guest user already exists.
 */
async function createGuestUser(guestName, avatar) {
  if (!guestName) {
    throw new BadRequestError("Please provide all required fields");
  }

  const formattedGuestName = guestName.toLowerCase();

  const existingGuest = await User.findOne({
    where: { userName: formattedGuestName },
  });

  if (existingGuest) {
    throw new BadRequestError("Guest already exists");
  }

  const guest = await User.create({
    userName: formattedGuestName,
    avatar,
    isGuest: true,
    role: "guest",
  });

  return guest;
}

/**
 * Logs in a user as a guest.
 *
 * @param {string} guestName - The name of the guest user.
 * @returns {Promise<import('../model/User')>} A Promise that resolves to the logged-in guest user.
 * @throws {BadRequestError} If required fields are not provided.
 * @throws {NotFoundError} If the guest user is not found.
 */
async function loginUserAsGuest(guestName) {
  const formattedGuestName = guestName.toLowerCase();

  if (!formattedGuestName) {
    throw new BadRequestError("Please provide all required fields");
  }

  const guest = await User.findOne({
    where: { userName: formattedGuestName },
  });

  if (!guest) {
    throw new NotFoundError("Guest not found");
  }

  return guest;
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  createGuestUser,
  loginUserAsGuest,
};
