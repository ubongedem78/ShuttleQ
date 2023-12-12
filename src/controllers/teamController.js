const { Team, User, Queue, Court, Guest } = require("../model");
const { Op } = require("sequelize");
const {
  validateGameType,
  validatePlayerNames,
  findUserIDs,
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

    // Check if any of the players are already in a team with a different game type
    const playersInTeamWithDifferentGameType = await Team.findOne({
      where: {
        [Op.or]: [
          { player1Id: userIDs, gameType: { [Op.not]: formattedGameType } },
          { player2Id: userIDs, gameType: { [Op.not]: formattedGameType } },
        ],
      },
    });

    if (playersInTeamWithDifferentGameType) {
      console.log(
        `Player(s) with id ${userIDs.join(
          " or "
        )} is already in a team with a different gameType (${
          playersInTeamWithDifferentGameType.gameType
        })`
      );
      return res.status(400).json({
        status: "error",
        message: `Player(s) with id ${userIDs.join(
          " or "
        )} is already in a team with a different gameType (${
          playersInTeamWithDifferentGameType.gameType
        })`,
      });
    }

    // Check if any of the players are already in the queue or playing
    const playersInQueueOrPlaying = await Queue.findOne({
      where: {
        playerId: userIDs,
        status: { [Op.in]: ["PENDING", "PLAYING"] },
      },
    });

    if (playersInQueueOrPlaying) {
      console.log(
        `Player(s) with id ${userIDs.join(
          " or "
        )} is already ${playersInQueueOrPlaying.status.toLowerCase()}`
      );
      return res.status(400).json({
        status: "error",
        message: `Player(s) with id ${userIDs.join(
          " or "
        )} is already ${playersInQueueOrPlaying.status.toLowerCase()}`,
      });
    }

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
    for (const userId of userIDs) {
      try {
        const isGuest = await Guest.findOne({ where: { id: userId } });

        if (isGuest) {
          // If it's a guest, update playerId in Guest table
          await Guest.update(
            { playerId: team.id },
            {
              where: {
                id: userId,
              },
            }
          );
        } else {
          // If it's a user, update playerId in User table
          await User.update(
            { playerId: team.id },
            {
              where: {
                id: userId,
              },
            }
          );
        }
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Something went wrong while updating the playerId",
        });
      }
    }

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
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating the team",
    });
  }
};

const getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findOne({
      where: {
        id: teamId,
      },
      include: [
        {
          model: User,
          as: "Player1",
          attributes: ["userName"],
          foreignKey: "player1Id",
        },
        {
          model: User,
          as: "Player2",
          attributes: ["userName"],
          foreignKey: "player2Id",
        },
      ],
    });

    if (!team) {
      return res.status(404).json({
        status: "error",
        message: `Team with id ${teamId} not found`,
      });
    }

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
