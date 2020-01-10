const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");

const resetpassword = express.Router();
const bodyParser = express.json();

resetpassword.route("/resetpassword").get(bodyParser, (req, res, next) => {
  const { email } = req.body;
  DataService.doesUserExist(req.app.get("db"), email)
    .then(user => {
      if (!user) {
        res.status(201).send("<h2>something went wrong</h2>");
      } else {
        const token = jwt.sign(
          {
            email,
            id: user.id
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(201).send();
      }
    })
    .catch(next);
});

module.exports = resetpassword;
