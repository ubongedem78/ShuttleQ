const express = require("express");
const router = express.Router();

const {
  createAndStartGame,
  fetchGameDetails,
  endGame,
} = require("../controllers/gameController");

router.get("/games/:gameId", fetchGameDetails);
router.post("/games", createAndStartGame);
router.put("/games/:gameId", endGame);

module.exports = router;
