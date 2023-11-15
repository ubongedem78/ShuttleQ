const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/users").get(getAllUsers).post(createUser);
router.route("/users/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
