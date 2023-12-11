const {
  getAllGuests,
  findGuestById,
  updateGuestDetails,
  deleteGuestById,
} = require("../utils/guestUtils");

// Get All Guests
const getGuests = async (req, res) => {
  try {
    const guests = await getAllGuests();
    return res.json({ guests });
  } catch (error) {
    console.error("Error in getGuests: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Guest By Id
const getGuestDetails = async (req, res) => {
  try {
    const guestId = req.params.id;

    const guest = await findGuestById(guestId);

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    return res.json({ guest });
  } catch (error) {
    console.error("Error in fetching single guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update Guest
const updateGuest = async (req, res) => {
  try {
    const { guestName } = req.body;
    const guestId = req.params.id;

    const guest = await findGuestById(guestId);

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    const updatedGuest = await updateGuestDetails(guestId, guestName);

    return res.status(200).json({ guest: updatedGuest });
  } catch (error) {
    console.error("Error in updating guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Guest
const deleteGuest = async (req, res) => {
  try {
    const guestId = req.params.id;

    const guestDeleted = await deleteGuestById(guestId);

    if (!guestDeleted) {
      return res.status(404).json({ error: "Guest not found" });
    }

    return res.status(204).json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Error in deleting guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGuests,
  getGuestDetails,
  updateGuest,
  deleteGuest,
};
