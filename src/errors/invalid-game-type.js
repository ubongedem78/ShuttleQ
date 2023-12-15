const BadRequestError = require("./bad-request");

class InvalidGameTypeError extends BadRequestError {
  constructor(message = "Invalid gameType") {
    super(message);
    this.name = "InvalidGameTypeError";
  }
}

module.exports = InvalidGameTypeError;
