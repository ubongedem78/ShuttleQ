const express = require("express");
const router = express.Router();
const {
  getQueue,
  deleteTeamFromQueue,
} = require("../controllers/queueController");

router.get("/queue", getQueue);
router.delete("/queue/:teamId", deleteTeamFromQueue);

module.exports = router;
