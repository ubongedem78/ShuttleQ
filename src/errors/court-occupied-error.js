const BadRequestError = require("./bad-request");

class CourtOccupiedError extends BadRequestError {
  constructor(courtName, gameType) {
    super(`Court ${courtName} is being used for ${gameType} games.`);
    this.name = "CourtOccupiedError";
  }
}

module.exports = CourtOccupiedError;
