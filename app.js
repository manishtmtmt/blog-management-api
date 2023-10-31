const express = require("express");
const path = require("path");

// Swagger configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connection = require("./config/db");
const logger = require("./middleware/logger");
const usersRouter = require("./routes/users-route");
const blogRouter = require("./routes/blog-route");

const PORT = process.env.PORT || 3000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Blog Management Platform",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "./routes", "*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", async (req, res) => {
  res.send("Welcome to Blog Management Platform.");
});

app.use("/api/auth", usersRouter);

app.use("/api/posts", blogRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Successfully connected to MONGODB.");
  } catch (error) {
    console.log("Failed to connect MONGODB due to error:", error);
  }
  console.log(`Server is up and running on ${PORT}`);
});

module.exports = { app, server };
