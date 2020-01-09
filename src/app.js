require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const routerHub = require("../app-data/router-hub");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
  })
);

app.use(helmet());
app.use(cors());
app.use(errorHandler);

app.use(routerHub);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;
