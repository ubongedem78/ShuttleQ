const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const { STRING, INTEGER, DATE, ENUM, UUID, UUIDV4, BOOLEAN } = DataTypes;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        user.avatar = user.userName.charAt(0).toUpperCase();
      },
      beforeUpdate: async (user) => {
        user.avatar = user.userName.charAt(0).toUpperCase();
      },
    },
  }
);

const Guest = sequelize.define(
  "Guest",
  {
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
    avatar: {
      type: STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (guest) => {
        guest.avatar = guest.userName.charAt(0).toUpperCase();
      },
      beforeUpdate: async (guest) => {
        guest.avatar = guest.userName.charAt(0).toUpperCase();
      },
    },
  }
);

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
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
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
    onDelete: "CASCADE",
  },
  winnerId: {
    type: UUID,
    allowNull: true,
  },
});

User.prototype.createJWT = function () {
  return jwt.sign(
    { userId: this.id, username: this.userName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

Guest.prototype.createJWT = function () {
  return jwt.sign(
    { userId: this.id, username: this.userName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

User.prototype.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.passwordHash);
  return isMatch;
};

Guest.hasOne(Team, {
  foreignKey: "playerId",
  as: "GuestTeam",
  onDelete: "CASCADE",
});
Team.belongsTo(Guest, { foreignKey: "player1Id", as: "GuestPlayer1" });
Team.belongsTo(Guest, { foreignKey: "player2Id", as: "GuestPlayer2" });

User.hasOne(Team, {
  foreignKey: "playerId",
  as: "PlayerTeam",
  onDelete: "CASCADE",
});
Team.belongsTo(User, { foreignKey: "player1Id", as: "Player1" });
Team.belongsTo(User, { foreignKey: "player2Id", as: "Player2" });

Court.hasOne(Queue, {
  foreignKey: "courtId",
  as: "Queue",
  onDelete: "CASCADE",
});
Queue.belongsTo(Court, { foreignKey: "courtId", as: "Court" });

Team.hasMany(Game, { foreignKey: "teamAId", as: "TeamA", onDelete: "CASCADE" });
Team.hasMany(Game, { foreignKey: "teamBId", as: "TeamB", onDelete: "CASCADE" });
Game.belongsTo(Team, { foreignKey: "teamAId", as: "TeamA" });
Game.belongsTo(Team, { foreignKey: "teamBId", as: "TeamB" });

Team.hasMany(RecentWinners, {
  foreignKey: "teamId",
  as: "RecentWinners",
  onDelete: "CASCADE",
});
RecentWinners.belongsTo(Team, { foreignKey: "teamId", as: "Team" });

Queue.hasMany(RecentWinners, {
  foreignKey: "queueId",
  as: "RecentWinners",
  onDelete: "CASCADE",
});
RecentWinners.belongsTo(Queue, { foreignKey: "queueId", as: "Queue" });

Court.hasMany(Game, { foreignKey: "courtId", as: "Game", onDelete: "CASCADE" });
Game.belongsTo(Court, { foreignKey: "courtId", as: "Court" });

Queue.belongsTo(Team, { foreignKey: "teamId", onDelete: "CASCADE" });
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
