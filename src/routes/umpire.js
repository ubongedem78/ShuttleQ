const express = require("express");
const router = express.Router();
const { createTeam } = require("../controllers/umpireController");

router.post("/teams", createTeam);

module.exports = router;
