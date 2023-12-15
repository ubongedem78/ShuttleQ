const CustomAPIError = require("./custom");

class InternalServerError extends CustomAPIError {
  constructor(message = "Internal Server Error") {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
