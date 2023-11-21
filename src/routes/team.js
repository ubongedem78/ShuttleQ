const express = require("express");
const router = express.Router();
const { createTeam, getTeamDetails } = require("../controllers/teamController");

router.post("/teams", createTeam);
router.get("/teams/:teamId", getTeamDetails);

module.exports = router;
