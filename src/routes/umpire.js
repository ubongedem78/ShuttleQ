const express = require("express");
const router = express.Router();
const { createTeam } = require("../controllers/umpireController");

router.post("/create-team", createTeam);

module.exports = router;
