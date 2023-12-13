const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
