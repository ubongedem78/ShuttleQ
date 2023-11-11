const express = require("express");
const router = express.Router();
const {
  createGame,
  startGame,
  endGame,
} = require("../controllers/gameController");

router.post("/game/create", createGame);
router.post("/game/start", startGame);
router.post("/game/end", endGame);

module.exports = router;
