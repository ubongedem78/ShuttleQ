const { Guest, Team } = require("../model");

async function getAllGuests() {
  const guests = await Guest.findAll();
  return guests;
}

async function findGuestById(guestId) {
  const guest = await Guest.findByPk(guestId, {
    include: [{ model: Team, as: "GuestTeam" }],
  });
  return guest;
}

async function updateGuestDetails(guestId, guestName) {
  const guest = await Guest.findByPk(guestId);
  if (guest) {
    await Guest.update({ userName: guestName }, { where: { id: guestId } });

    const updatedGuest = await findGuestById(guestId);
    return updatedGuest;
  }
  return null;
}

async function deleteGuestById(guestId) {
  const guest = await Guest.findByPk(guestId);
  if (guest) {
    await guest.destroy();
    return true;
  }
  return false;
}

module.exports = {
  getAllGuests,
  findGuestById,
  updateGuestDetails,
  deleteGuestById,
};
