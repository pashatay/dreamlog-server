const express = require("express");
const DataService = require("../data-service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xss = require("xss");

const login = express.Router();
const bodyParser = express.json();

login
  .route("/login")
  .get(bodyParser, (req, res, next) => {
    return res.status(400).send({
      error: { message: `you must login first` }
    });
  })
  .post(bodyParser, (req, res, next) => {
    const { email, password } = req.body;
    DataService.findUserPassword(req.app.get("db"), email)
      .then(user => {
        if (!user) {
          return res
            .status(400)
            .send({ error: { message: "Incorrect email or password!" } });
        } else if (!user.verified) {
          return res
            .status(403)
            .send({ error: { message: "Please verify your account first." } });
        }
        return bcrypt.compare(password, user.password).then(passwordsMatch => {
          if (!passwordsMatch) {
            return res
              .status(401)
              .send({ error: { message: "Incorrect email or password!" } });
          }
          const token = jwt.sign(
            {
              email,
              id: user.id
            },
            process.env.JWT_KEY,
            { expiresIn: "10h" }
          );
          res.status(200).json({
            message: xss("Auth successful"),
            token: xss(token),
            id: xss(user.id),
            name: xss(user.name)
          });
          next();
        });
      })
      .catch(next);
  });
module.exports = login;
