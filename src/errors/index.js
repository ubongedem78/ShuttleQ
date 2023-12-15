const CustomAPIError = require("./custom");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./notFound");
const BadRequestError = require("./bad-request");
const InternalServerError = require("./InternalServerError");
const InvalidGameTypeError = require("./invalid-game-type");
const InvalidPlayerNamesError = require("./invalid-player-names");
const QueueOrPlayingError = require("./queue-or-playing-error");
const TeamGameTypeError = require("./team-game-type-error");
const CourtOccupiedError = require("./court-occupied-error");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  InvalidGameTypeError,
  InvalidPlayerNamesError,
  QueueOrPlayingError,
  TeamGameTypeError,
  CourtOccupiedError,
};
