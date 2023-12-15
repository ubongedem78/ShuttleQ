const CustomAPIError = require("./custom");

class NotFoundError extends CustomAPIError {
  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
