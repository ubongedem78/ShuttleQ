const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const { sequelize } = require("./src/config/database");
const authenticate = require("./src/middlewares/auth");
const errorHandlerMiddleware = require("./src/middlewares/error-handler");
const notFoundMiddleware = require("./src/middlewares/notFound");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./src/swagger");
const { createClient } = require("redis");
const RedisStore = require("connect-redis").default;

const client = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
client.on("error", (error) => {
  console.error("Redis connection error:", error);
});
client.on("connect", () => {
  console.log("Redis connected");
});
let redisStore = new RedisStore({ client });
client.connect().catch(console.error);

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://shuttleq.vercel.app/",
    credentials: true,
  })
);

app.use(
  session({
    store: redisStore,
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
