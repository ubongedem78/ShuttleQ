const CustomAPIError = require("./custom");

class UnauthenticatedError extends CustomAPIError {
  constructor(message = "Unauthenticated") {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthenticatedError;
