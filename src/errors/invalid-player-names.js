const BadRequestError = require("./bad-request");

class InvalidPlayerNamesError extends BadRequestError {
  constructor(message = "Player Names must be a string") {
    super(message);
    this.name = "InvalidPlayerNamesError";
  }
}

module.exports = InvalidPlayerNamesError;
