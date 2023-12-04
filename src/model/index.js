const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const { STRING, INTEGER, DATE, ENUM, UUID, UUIDV4, BOOLEAN } = DataTypes;
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email address already exists",
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Please enter a valid email address",
        },
      },
    },
    avatar: {
      type: STRING,
      allowNull: true,
    },
    userName: {
      type: STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username already exists",
      },
      validate: {
        len: {
          args: [3, 20],
          msg: "Username must be between 3 and 20 characters",
        },
      },
    },
    passwordHash: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.avatar = user.userName.charAt(0).toUpperCase();
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      },
      beforeUpdate: async (user) => {
        user.avatar = user.userName.charAt(0).toUpperCase();
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      },
    },
  }
);

const Guest = sequelize.define("Guest", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  userName: {
    type: STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: "Username already exists",
    },
    validate: {
      len: {
        args: [3, 20],
        msg: "Username must be between 3 and 20 characters",
      },
    },
  },
});

const Court = sequelize.define("Court", {
  courtId: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  courtName: {
    type: STRING,
    allowNull: false,
  },
  courtType: {
    type: ENUM("ADVANCED", "INTERMEDIATE", "BEGINNERS"),
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
  player1Id: {
    type: UUID,
    allowNull: false,
    unique: true,
  },
  player2Id: {
    type: UUID,
    allowNull: true,
    unique: true,
  },
  gameType: {
    type: ENUM("SINGLES", "DOUBLES"),
    allowNull: false,
  },
  courtId: {
    type: UUID,
    allowNull: false,
    references: {
      model: Court,
      key: "courtId",
    },
  },
  consecutiveWins: {
    type: INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
    unique: true,
  },
  status: {
    type: ENUM("PENDING", "PLAYING"),
    allowNull: false,
  },
  playerName: {
    type: STRING,
    allowNull: false,
  },
  gameType: {
    type: ENUM("SINGLES", "DOUBLES"),
    allowNull: false,
  },
  courtId: {
    type: UUID,
    allowNull: false,
    references: {
      model: Court,
      key: "courtId",
    },
  },
  teamId: {
    type: UUID,
    allowNull: true,
    references: {
      model: Team,
      key: "id",
    },
  },
  timestamp: {
    type: DATE,
    allowNull: false,
  },
});

const RecentWinners = sequelize.define("RecentWinners", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  teamId: {
    type: UUID,
    allowNull: false,
  },
  gameType: {
    type: ENUM("SINGLES", "DOUBLES"),
    allowNull: false,
  },
  consecutiveWins: {
    type: INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  timestamp: {
    type: DATE,
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
  gameType: {
    type: ENUM("SINGLES", "DOUBLES"),
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
  teamAName: {
    type: STRING,
    allowNull: true,
  },
  teamBName: {
    type: STRING,
    allowNull: true,
  },
  teamAScore: {
    type: INTEGER,
    defaultValue: 0,
  },
  teamBScore: {
    type: INTEGER,
    defaultValue: 0,
  },
  status: {
    type: ENUM("PLAYING", "ENDED"),
    allowNull: false,
  },
  courtId: {
    type: UUID,
    allowNull: false,
    references: {
      model: Court,
      key: "courtId",
    },
  },
  winnerId: {
    type: UUID,
    allowNull: true,
  },
});

User.hasOne(Team, { foreignKey: "playerId", as: "PlayerTeam" });
Team.belongsTo(User, { foreignKey: "player1Id", as: "Player1" });
Team.belongsTo(User, { foreignKey: "player2Id", as: "Player2" });

Guest.hasOne(Team, { foreignKey: "playerId", as: "GuestTeam" });
Team.belongsTo(Guest, { foreignKey: "player1Id", as: "GuestPlayer1" });
Team.belongsTo(Guest, { foreignKey: "player2Id", as: "GuestPlayer2" });

Court.hasOne(Queue, { foreignKey: "courtId", as: "Queue" });
Queue.belongsTo(Court, { foreignKey: "courtId", as: "Court" });

Team.hasMany(Game, { foreignKey: "teamAId", as: "TeamA" });
Team.hasMany(Game, { foreignKey: "teamBId", as: "TeamB" });
Game.belongsTo(Team, { foreignKey: "teamAId", as: "TeamA" });
Game.belongsTo(Team, { foreignKey: "teamBId", as: "TeamB" });

Team.hasMany(RecentWinners, { foreignKey: "teamId", as: "RecentWinners" });
RecentWinners.belongsTo(Team, { foreignKey: "teamId", as: "Team" });

Queue.hasMany(RecentWinners, { foreignKey: "queueId", as: "RecentWinners" });
RecentWinners.belongsTo(Queue, { foreignKey: "queueId", as: "Queue" });

Court.hasMany(Game, { foreignKey: "courtId", as: "Game" });
Game.belongsTo(Court, { foreignKey: "courtId", as: "Court" });

Queue.belongsTo(Team, { foreignKey: "teamId" });
Team.hasOne(Queue, { foreignKey: "teamId" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database Synced Successfully...");
  })
  .catch((err) => {
    console.error("Database Sync Failed, error: ", err);
  });

module.exports = { User, Court, Game, Queue, Team, RecentWinners, Guest };
