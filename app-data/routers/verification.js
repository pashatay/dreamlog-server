const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");

const verification = express.Router();
const bodyParser = express.json();

verification.route("/verification").get(bodyParser, (req, res, next) => {
  const { code } = req.query;
  DataService.verifyUser(req.app.get("db"), code)
    .then(user => {
      if (!user) {
        res.status(201).send("<h2>something went wrong</h2>");
      } else {
        logger.info(`User verified`);
        res
          .status(201)
          .send(
            "<h2>Your email has been verified. You can <a href='https://dreamlog.now.sh/'>login</a> now.</h2>"
          );
      }
    })
    .catch(next);
});

module.exports = verification;
