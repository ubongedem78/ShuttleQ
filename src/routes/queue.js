const express = require("express");
const router = express.Router();
const {
  getQueue,
  getQueueForCourt,
  deleteTeamFromQueue,
} = require("../controllers/queueController");

router.get("/queues", getQueue);
router.get("/queues/:courtId", getQueueForCourt);
router.delete("/queues/:teamId", deleteTeamFromQueue);

module.exports = router;
