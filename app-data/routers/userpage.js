const express = require("express");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const validateBearerToken = require("../../src/validate-token");
const userid = require("../../src/validate-token");

const userPage = express.Router();
const bodyParser = express.json();

userPage
  .route("/userpage")
  .get(bodyParser, validateBearerToken, (req, res, next) => {
    DataService.doesUserExist(req.app.get("db"), 10)
      .then(friends => {
        logger.info(`Friends list fetched`);
        res.status(201).json("da");
      })
      .catch(next);
  });

module.exports = userPage;
