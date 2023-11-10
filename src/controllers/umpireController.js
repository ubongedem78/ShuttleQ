const { Team, User, Queue } = require("../model");

//Create a new team
const createTeam = async (req, res) => {
  try {
    const { gameType, playerNames } = req.body;

    //validate gameType
    if (!gameType || !["SINGLES", "DOUBLES"].includes(gameType.toUpperCase())) {
      return res.status(400).json({
        status: "error",
        message: "Invalid gameType",
      });
    }

    // Check if the playerNames is a string
    if (typeof playerNames !== "string") {
      return res.status(400).json({
        status: "error",
        message: "playerNames must be a string",
      });
    }

    const players = playerNames
      .split(",")
      .map((playerName) => playerName.trim());

    //validate playerNames based on gameType
    if (
      (gameType.toUpperCase() === "DOUBLES" &&
        (!playerNames || playerNames.split(",").length !== 2)) ||
      (gameType.toUpperCase() === "SINGLES" &&
        (!playerNames || playerNames.split(",").length !== 1))
    ) {
      return res.status(400).json({
        status: "error",
        message: `For ${gameType.toUpperCase()}, you must provide required number of players`,
      });
    }

    //you want to find the userIDs of the players
    const userIDs = [];
    for (const playerName of players) {
      const user = await User.findOne({ where: { firstName: playerName } });
      if (user) {
        userIDs.push(user.id);
      } else {
        return res.status(400).json({
          status: "error",
          message: `Player with name ${playerName} does not exist`,
        });
      }
    }

    //Create Team
    const team = await Team.create({
      gameType: gameType.toUpperCase(),
      player1Id: userIDs[0],
      player2Id: userIDs[1] || null,
      isActive: false,
    });

    //Make entry into queue
    await Queue.create({
      teamId: team.id,
      gameType: gameType.toUpperCase(),
      status: "PENDING",
      playerId: team.player1Id,
      playerName:
        playerNames.split(",")[0] +
        (playerNames.split(",")[1] ? " / " + playerNames.split(",")[1] : ""),
      timestamp: new Date(),
    });

    return res.status(201).json({ team });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong whilst creating team",
    });
  }
};

module.exports = { createTeam };
