const {
  validateGameType,
  validatePlayerNames,
  findUserIDs,
  checkPlayersInTeams,
  checkPlayersInQueueOrPlaying,
  updateTablesWithPlayerID,
  fetchTeamDetails,
  typeOfGamesOnCourt,
  createTeamfromPlayerNames,
  createTeamEntryIntoQueue,
} = require("../utils/teamUtils");

// Create a new team
const createTeam = async (req, res, next) => {
  try {
    const { gameType, playerNames, courtId } = req.body;

    const formattedGameType = await validateGameType(gameType);

    const players = await validatePlayerNames(playerNames, formattedGameType);

    const userIDs = await findUserIDs(players);

    await checkPlayersInTeams(userIDs, formattedGameType);

    await checkPlayersInQueueOrPlaying(userIDs);

    await typeOfGamesOnCourt(courtId, formattedGameType);

    const team = await createTeamfromPlayerNames(
      formattedGameType,
      userIDs,
      courtId
    );

    await updateTablesWithPlayerID(userIDs, team);

    await createTeamEntryIntoQueue(team, formattedGameType, playerNames, courtId);

    return res.status(201).json({ team });
  } catch (error) {
    console.error("Error in createTeam: ", error);
    next(error);
  }
};

const getTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const team = await fetchTeamDetails(teamId);

    return res.status(200).json({
      status: "success",
      data: team,
    });
  } catch (error) {
    console.error("Error in getTeamDetails: ", error);
    next(error);
  }
};

module.exports = { createTeam, getTeamDetails };
