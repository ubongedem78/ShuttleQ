const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const { Op } = require("sequelize");
const { STRING, INTEGER, DATE, ENUM, UUID, UUIDV4, BOOLEAN } = DataTypes;

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
    validate: {
      isAlpha: {
        args: true,
        msg: "First name must only contain alphabets",
      },
      len: {
        args: [3, 10],
        msg: "First name must be between 3 and 10 characters",
      },
    },
  },
  lastName: {
    type: STRING,
    allowNull: false,
    validate: {
      isAlpha: {
        args: true,
        msg: "First name must only contain alphabets",
      },
      len: {
        args: [3, 10],
        msg: "First name must be between 3 and 10 characters",
      },
    },
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
    set(value) {
      if (!value) {
        this.setDataValue(
          "avatar",
          this.getDataValue("firstName")[0].toUpperCase() ||
            this.getDataValue("userName")[0].toUpperCase()
        );
      } else {
        this.setDataValue(
          "avatar",
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
        );
      }
    },
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
  role: {
    type: ENUM("PLAYER", "UMPIRE", "ADMIN"),
    allowNull: false,
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
  status: {
    type: ENUM("PENDING", "PLAYING"),
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
  },
  consecutiveWins: {
    type: INTEGER,
    defaultValue: 0,
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
  player1Id: {
    type: UUID,
    allowNull: false,
  },
  player2Id: {
    type: UUID,
    allowNull: true,
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
    allowNull: false,
  },
  isActive: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const CourtQueue = sequelize.define("CourtQueue", {
  queueId: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Queue,
      key: "queueId",
    },
  },
  courtId: {
    type: UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Court,
      key: "courtId",
    },
  },
});

User.hasOne(Queue, { foreignKey: "playerId", as: "currentQueue" });
Queue.hasOne(User, { foreignKey: "playerId", as: "Player" });

User.hasOne(Team, { foreignKey: "playerId", as: "Player" });
Team.belongsTo(User, { foreignKey: "playerId", as: "Player" });

Team.hasMany(Game, { foreignKey: "teamAId", as: "TeamA" });
Team.hasMany(Game, { foreignKey: "teamBId", as: "TeamB" });
Game.belongsTo(Team, { foreignKey: "teamAId", as: "TeamA" });
Game.belongsTo(Team, { foreignKey: "teamBId", as: "TeamB" });

Queue.hasMany(Game, { foreignKey: "queueId" });
Game.belongsTo(Queue, { foreignKey: "queueId" });

Court.hasOne(Queue, { foreignKey: "courtId" });
Queue.belongsTo(Court, { foreignKey: "courtId" });

Queue.belongsTo(Team, { foreignKey: "teamId" });
Team.hasOne(Queue, { foreignKey: "teamId" });

Court.hasOne(CourtQueue, { foreignKey: "courtId" });
CourtQueue.belongsTo(Court, { foreignKey: "courtId" });

Queue.hasOne(CourtQueue, { foreignKey: "queueId" });
CourtQueue.belongsTo(Queue, { foreignKey: "queueId" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database Synced Successfully...");
  })
  .catch((err) => {
    console.error("Database Sync Failed, error: ", err);
  });

module.exports = { User, Court, Game, Queue, Team, CourtQueue };
