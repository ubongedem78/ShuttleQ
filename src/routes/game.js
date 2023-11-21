const express = require("express");
const router = express.Router();

const {
  createAndStartGame,
  fetchGameDetails,
  startGame,
  endGame,
} = require("../controllers/gameController");

router.get("/games/:gameId", fetchGameDetails);
router.post("/games", createAndStartGame);
router.put("/games/:gameId/start", startGame);
router.put("/games/:gameId/end", endGame);

module.exports = router;
