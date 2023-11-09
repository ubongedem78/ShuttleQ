const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
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
    allowNull: false,
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
  isActive: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Here, i want to find the previous active team of the player and set the isActive to false: This ensures that the previous team of the player is set as inactive. After doing this, i want to set the current team of the player as active.
// This block runs before a new team is created
Team.addHook("beforeCreate", async (team, options) => {
  await Team.update(
    { isActive: false },
    {
      where: {
        playerId: team.playerId,
        isActive: true,
      },
      individualHooks: true,
      transaction: options.transaction,
    }
  );

  team.isActive = true;
});

// It checks if the isActive flag is being updated to true. If yes, it proceeds with deactivating the previous active team.
// It finds the previous active team of the player and sets its isActive flag to false
// This block runs before updating an existing team
Team.addHook("beforeUpdate", async (team, options) => {
  if (team.isActive === true) {
    await Team.update(
      { isActive: false },
      {
        where: {
          playerId: team.playerId,
          isActive: true,
        },
        individualHooks: true,
        transaction: options.transaction,
      }
    );
  }
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

Team.hasOne(Game, { foreignKey: "teamAId", as: "teamA" });
Team.hasOne(Game, { foreignKey: "teamBId", as: "teamB" });

Game.belongsTo(Team, { foreignKey: "teamAId", as: "teamA" });
Game.belongsTo(Team, { foreignKey: "teamBId", as: "teamB" });

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
