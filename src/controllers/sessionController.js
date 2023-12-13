const { endCurrentCourtSession } = require("../utils/sessionUtil");

const endSession = async (req, res, next) => {
  const courtId = req.params.id;
  try {
    await endCurrentCourtSession(courtId);

    res.status(200).json({ message: "Session ended" });
  } catch (error) {
    next(error);
  }
};

module.exports = { endSession };
