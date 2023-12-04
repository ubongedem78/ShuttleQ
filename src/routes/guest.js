const express = require("express");
const router = express.Router();

const {
  getGuests,
  createGuest,
  getGuestDetails,
  updateGuest,
  deleteGuest,
} = require("../controllers/guestController");

router.route("/guests").get(getGuests).post(createGuest);
router
  .route("/guests/:id")
  .get(getGuestDetails)
  .put(updateGuest)
  .delete(deleteGuest);

module.exports = router;