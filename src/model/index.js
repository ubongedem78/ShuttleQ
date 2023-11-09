const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const { STRING, INTEGER, DATE, ENUM, UUID, UUIDV4 } = DataTypes;

const User = sequelize.define("User", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  avatar: {
    type: STRING,
  },
  userName: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: ENUM("PLAYER", "UMPIRE", "ADMIN"),
    allowNull: false,
  },
});

const Court = sequelize.define("Court", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
  },
  courtName: {
    type: STRING,
    allowNull: false,
  },
  courtType: {
    type: STRING,
    allowNull: false,
  },
});

const Game = sequelize.define("Game", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  type: {
    gameType: ENUM("SINGLES", "DOUBLES"),
    allowNull: false,
  },
  teamAId: {
    type: UUID,
    allowNull: false,
  },
  teamBId: {
    type: UUID,
    allowNull: false,
  },
  status: {
    type: ENUM("PENDING", "PLAYING"),
    allowNull: false,
  },
  courtId: {
    type: UUID,
    allowNull: false,
  },
  winnerId: {
    type: UUID,
  },
  winCount: {
    type: INTEGER,
    defaultValue: 0,
  },
  queueId: {
    type: UUID,
  },
});

const Queue = sequelize.define("Queue", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  playerId: {
    type: UUID,
    allowNull: false,
  },
  status: {
    type: ENUM("PENDING", "PLAYING"),
    allowNull: false,
  },
  timestamp: {
    type: DATE,
    allowNull: false,
  },
});

const Team = sequelize.define("Team", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  gameType: {
    type: ENUM("SINGLES", "DOUBLES"),
    allowNull: false,
  },
});

User.hasOne(Queue, { as: "currentQueue", foreignKey: "playerId" });
Queue.belongsTo(User, { as: "player", foreignKey: "playerId" });

User.hasMany(Team, { as: "teams", foreignKey: "playerId" });
Team.belongsTo(User, { as: "player", foreignKey: "playerId" });

Queue.belongsToMany(Team, {
  through: "QueueTeam",
  foreignKey: "queueId",
  otherKey: "teamId",
});
Team.belongsToMany(Queue, {
  through: "QueueTeam",
  foreignKey: "teamId",
  otherKey: "queueId",
});

Game.belongsTo(Queue, { as: "queue", foreignKey: "queueId" });
Game.belongsTo(Court, { as: "court", foreignKey: "courtId" });

sequelize
  .sync()
  .then(() => {
    console.log("Database Synced Successfully...");
  })
  .catch((err) => {
    console.error("Database Sync Failed, error: ", err);
  });

module.exports = { User, Court, Game, Queue, Team };
