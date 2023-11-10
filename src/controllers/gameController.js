const { Game, Court, Team } = require("../model");

//Create A Game
const createGame = async (req, res) => {
  try {
    const { gameType, teamAId, teamBId, courtId, queueId } = req.body;

    //you want to check if the teams exist
    const teamA = await Team.findOne({ where: { id: teamAId } });
    const teamB = await Team.findOne({ where: { id: teamBId } });

    if (!teamA || !teamB) {
      return res
        .status(400)
        .send({ message: "One or both of the teams do not exist" });
    }

    //you want to check if the court exists
    const court = await Court.findOne({ where: { id: courtId } });

    if (!court) {
      return res.status(400).send({ message: "The court does not exist" });
    }

    //you want to check if the queue exists
    const queue = await Queue.findOne({ where: { id: queueId } });

    if (!queue) {
      return res.status(400).send({ message: "Queue does not exist" });
    }

    //Check if the queue has enough players to start a game for each type(2 players/teams singles and 4 players/2 teams for doubles)
    if (gameType === "SINGLES" && queue.players.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough players to start a singles game" });
    } else if (gameType === "DOUBLES" && queue.players.length < 4) {
      return res
        .status(400)
        .send({ message: "Not enough players to start a doubles game" });
    }

    //check if teams are in the same court's queue
    if (teamA.courtId !== teamB.courtId) {
      return res
        .status(400)
        .send({ message: "Teams are not in the same court" });
    }

    //check if game type is valid
    if (!["SINGLES", "DOUBLES"].includes(gameType.toUpperCase())) {
      return res.status(400).send({ message: "Invalid game type" });
    }

    //create game finally
    const game = await Game.create({
      gameType: gameType.toUpperCase(),
      teamAId: teamA.id,
      teamBId: teamB.id,
      courtId: courtId,
      queueId: queueId,
      status: "PENDING",
    });

    res.status(201).send({ message: "Game created successfully", game });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create game" });
  }
};

module.exports = { createGame };
