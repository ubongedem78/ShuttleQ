const express = require("express");
const router = express.Router();
const {
  createGame,
  getGameDetails,
  startGame,
  endGame,
} = require("../controllers/gameController");

router.post("/game/create", createGame);
router.get("/game/:gameId", getGameDetails);
router.post("/game/start", startGame);
router.post("/game/end", endGame);

module.exports = router;
