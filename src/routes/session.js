const express = require("express");
const router = express.Router();

const { endSession } = require("../controllers/sessionController");

router.delete("/sessions/:courtId", endSession);

module.exports = router;
