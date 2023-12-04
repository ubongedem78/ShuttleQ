const { Guest, Team } = require("../model");

// Get All Guests
const getGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    return res.json({ guests });
  } catch (error) {
    console.error("Error in getGuests: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Create Guest
const createGuest = async (req, res) => {
  try {
    const { guestName } = req.body;

    if (!guestName) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const existingGuest = await Guest.findOne({
      where: { guestName: guestName },
    });

    if (existingGuest) {
      return res.status(400).json({ error: "Guest already exists" });
    }

    const guest = await Guest.create({
      guestName,
      guestAvatar,
    });
    return res.status(201).json({ guest });
  } catch (error) {
    console.error("Error in creating guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Guest By Id
const getGuestDetails = async (req, res) => {
  try {
    const guestId = req.params.id;
    const guest = await Guest.findByPk(guestId, {
      include: [{ model: Team, as: "GuestTeam" }],
    });
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
    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    await guest.update({ guestName });
    return res.status(200).json({ guest });
  } catch (error) {
    console.error("Error in updating guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Guest
const deleteGuest = async (req, res) => {
  try {
    const guestId = req.params.id;
    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    await guest.destroy();
    return res.status(204).json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Error in deleting guest: ", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGuests,
  createGuest,
  getGuestDetails,
  updateGuest,
  deleteGuest,
};
