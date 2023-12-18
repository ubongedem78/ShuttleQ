const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const { sequelize, pool } = require("./src/config/database");
const authenticate = require("./src/middlewares/auth");
const errorHandlerMiddleware = require("./src/middlewares/error-handler");
const notFoundMiddleware = require("./src/middlewares/notFound");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");
const pgSession = require("connect-pg-simple")(session);

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://shuttleq.vercel.app",
    credentials: true,
  })
);

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

readdirSync("./src/routes").map((routePath) => {
  if (routePath === "auth.js") {
    return app.use("/api/v1", require(`./src/routes/${routePath}`));
  }
  app.use("/api/v1", authenticate, require(`./src/routes/${routePath}`));
});

app.get("/", (req, res) => {
  res.send("I AM WORKING, BUT YOUVE GOTTA WORK TOO");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
