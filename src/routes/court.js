const express = require("express");
const router = express.Router();

const {
  createCourt,
  getCourts,
  deleteCourt,
} = require("../controllers/courtController");

router.post("/courts", createCourt);
router.get("/courts", getCourts);
router.delete("/courts/:courtId", deleteCourt);

module.exports = router;
