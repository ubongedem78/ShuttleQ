const express = require("express");
const router = express.Router();
const {
  createGame,
  getGameDetails,
  startGame,
  endGame,
} = require("../controllers/gameController");

router.route("/games").post(createGame).delete(endGame);
router.get("/games/:gameId", getGameDetails);

router.post("/game/start", startGame);

module.exports = router;
