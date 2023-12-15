const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShuttleQ API",
      version: "1.0.0",
      description: "API documentation for ShuttleQ application",
    },
    servers: [
      {
        url: "https://shuttleq.vercel.app",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
