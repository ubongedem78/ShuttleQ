const { User } = require("../model");
const { BadRequestError, NotFoundError } = require("../errors");

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
  const token = user.createJWT();
  return { user, token };
}

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

  const token = user.createJWT();
  return { user, token };
}

async function logoutUser(req) {
  req.session.destroy();
}

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
