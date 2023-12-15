const express = require("express");
const router = express.Router();

const {
  createCourt,
  getCourts,
  updateCourt,
  deleteCourt,
} = require("../controllers/courtController");

router.post("/courts", createCourt);
router.get("/courts", getCourts);
router.route("/courts/:courtId").delete(deleteCourt).put(updateCourt);

module.exports = router;
