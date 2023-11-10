const express = require("express");
const router = express.Router();

const {
  createCourt,
  getCourts,
  deleteCourt,
} = require("../controllers/courtController");

router.post("/court", createCourt);
router.get("/court", getCourts);
router.delete("/court/:courtId", deleteCourt);

module.exports = router;
