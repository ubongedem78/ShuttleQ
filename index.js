const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const { sequelize } = require("./src/config/database");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

readdirSync("./src/routes").map((path) => {
  app.use("/api", require(`./src/routes/${path}`));
});

app.get("/", (req, res) => {
  res.send("I AM WORKING, BUT YOUVE GOTTA WORK TOO");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ShuttleQ is Running on Port: ${PORT}`);
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.error("Database Connection Failed, error: ", err);
    });
});

module.exports = app;
