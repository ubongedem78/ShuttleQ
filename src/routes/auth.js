const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  createGuest,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/guests").post(createGuest);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
