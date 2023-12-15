const {
  getAllGuests,
  findGuestById,
  updateGuestDetails,
  deleteGuestById,
} = require("../utils/guestUtils");

const { NotFoundError } = require("../errors");

// Get All Guests
const getGuests = async (req, res, next) => {
  try {
    const guests = await getAllGuests();

    res.json({ guests });
  } catch (error) {
    console.error("Error in getGuests: ", error);
    next(error);
  }
};

// Get Guest By Id
const getGuestDetails = async (req, res, next) => {
  try {
    const guestId = req.params.id;

    const guest = await findGuestById(guestId);

    res.json({ guest });
  } catch (error) {
    console.error("Error in fetching single guest: ", error);
    next(error);
  }
};

// Update Guest
const updateGuest = async (req, res, next) => {
  try {
    const { guestName } = req.body;
    const guestId = req.params.id;

    await findGuestById(guestId);

    const updatedGuest = await updateGuestDetails(guestId, guestName);

    res.status(200).json({ guest: updatedGuest });
  } catch (error) {
    console.error("Error in updating guest: ", error);
    next(error);
  }
};

// Delete Guest
const deleteGuest = async (req, res, next) => {
  try {
    const guestId = req.params.id;

    await deleteGuestById(guestId);

    res.status(200).json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Error in deleting guest: ", error);
    next(error);
  }
};

module.exports = {
  getGuests,
  getGuestDetails,
  updateGuest,
  deleteGuest,
};
