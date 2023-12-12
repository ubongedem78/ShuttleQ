const { Team, Queue } = require("../model");
const {
  validateGameType,
  validatePlayerNames,
  findUserIDs,
  checkPlayersInTeams,
  checkPlayersInQueueOrPlaying,
  updateTablesWithPlayerID,
  fetchTeamDetails,
} = require("../utils/teamUtils");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { gameType, playerNames, courtId } = req.body;

    // Validation for gameType
    const formattedGameType = await validateGameType(gameType);

    const players = await validatePlayerNames(playerNames, formattedGameType);

    const userIDs = await findUserIDs(players);
    console.log("userIDs", userIDs);

    await checkPlayersInTeams(userIDs, formattedGameType);

    await checkPlayersInQueueOrPlaying(userIDs);

    // Create Team
    const team = await Team.create({
      gameType: formattedGameType,
      player1Id: userIDs[0],
      player2Id: userIDs[1] || null,
      courtId: courtId || null,
      playerId: userIDs[0],
      isActive: true,
    });
    console.log("team", team);

    // Update playerId in User or Guest table for all players
    await updateTablesWithPlayerID(userIDs, team);

    // Make an entry into the queue
    await Queue.create({
      teamId: team.id,
      gameType: formattedGameType,
      status: "PENDING",
      playerId: team.player1Id,
      playerName:
        playerNames.split(",")[0] +
        (playerNames.split(",")[1] ? "/" + playerNames.split(",")[1] : ""),
      courtId,
      timestamp: new Date(),
    });

    return res.status(201).json({ team });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating the team",
    });
  }
};

const getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await fetchTeamDetails(teamId);

    return res.status(200).json({
      status: "success",
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the team details",
    });
  }
};

module.exports = { createTeam, getTeamDetails };
