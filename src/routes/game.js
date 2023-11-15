const express = require("express");
const router = express.Router();

const {
  createGame,
  fetchGameDetails,
  startGame,
  endGame,
} = require("../controllers/gameController");

router.get("/games/:gameId", fetchGameDetails);
router.post("/games", createGame);
router.put("/games/:gameId/start", startGame);
router.put("/games/:gameId/end", endGame);

module.exports = router;
