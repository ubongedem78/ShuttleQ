const { Sequelize } = require("sequelize");
const { Pool } = require("pg");
require("dotenv").config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  dialectModule: require("pg"),
  define: {
    freezeTableName: true,
    timestamps: true,
  },
  logging: false,
});

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

module.exports = { sequelize, pool };
