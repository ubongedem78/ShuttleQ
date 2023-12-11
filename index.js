const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const { sequelize } = require("./src/config/database");
const authenticate = require("./src/middlewares/auth");
const cors = require("cors");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://127.0.0.1:5500", //"https://shuttleq.vercel.app",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

readdirSync("./src/routes").map((path) => {
  if (path === "auth.js") {
    return app.use("/api/v1", require(`./src/routes/${path}`));
  }
  app.use("/api/v1", authenticate, require(`./src/routes/${path}`));
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
