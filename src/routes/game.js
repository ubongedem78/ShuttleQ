const express = require("express");
const router = express.Router();

const {
  startGameController,
  fetchGameDetails,
  endGameController,
} = require("../controllers/gameController");

router.get("/games/:gameId", fetchGameDetails);
router.post("/games", startGameController);
router.put("/games/:gameId", endGameController);

module.exports = router;
