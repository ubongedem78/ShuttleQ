const express = require("express");
const router = express.Router();
const {
  getQueue,
  getQueueForCourt,
  deleteTeamFromQueue,
} = require("../controllers/queueController");

router.get("/queue", getQueue);
router.get("/queue/:courtId", getQueueForCourt);
router.delete("/queue/:teamId", deleteTeamFromQueue);

module.exports = router;
