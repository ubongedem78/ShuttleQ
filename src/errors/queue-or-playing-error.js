const BadRequestError = require("./bad-request");

class QueueOrPlayingError extends BadRequestError {
  constructor(playersInQueueOrPlaying, userIDs) {
    super(
      `Player(s) with id ${userIDs.join(" or ")} is already in a ${
        playersInQueueOrPlaying.gameType
      } team`
    );
    this.name = "QueueOrPlayingError";
  }
}

module.exports = QueueOrPlayingError;
