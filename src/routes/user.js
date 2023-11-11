const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/user").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
