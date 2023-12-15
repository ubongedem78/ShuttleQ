const BadRequestError = require("./bad-request");

class TeamGameTypeError extends BadRequestError {
  constructor(playersInTeamWithDifferentGameType, userIDs) {
    super(
      `Player(s) with id ${userIDs.join(
        " or "
      )} is already in a team with a different gameType (${
        playersInTeamWithDifferentGameType.gameType
      })`
    );
    this.name = "TeamGameTypeError";
  }
}

module.exports = TeamGameTypeError;
