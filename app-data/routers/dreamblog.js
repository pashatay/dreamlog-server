const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");

const dreamblog = express.Router();
const bodyParser = express.json();

dreamblog
  .route("/dreamblog/:userid")
  .all(bodyParser, (req, res, next) => {
    const { userid } = req.params;
    DataService.doesUserPageExist(req.app.get("db"), userid).then(user => {
      if (!user) {
        res.status(400).json({ error: "User not found." });
      }
    });
    next();
  })
  .get(bodyParser, (req, res, next) => {
    const { userid } = req.params;
    DataService.findUserPublicDreams(req.app.get("db"), userid)
      .then(dreams => {
        if (!dreams[0]) {
          res.status(401).json({ error: "No dreams found." });
        } else {
          logger.info(`Dreams list fetched`);
          res.status(201).json(dreams.map(DataService.serializeDream));
        }
      })
      .catch(next);
  });

module.exports = dreamblog;
