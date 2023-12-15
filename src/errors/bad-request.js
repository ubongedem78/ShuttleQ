const CustomAPIError = require('./custom');

class BadRequestError extends CustomAPIError {
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;

