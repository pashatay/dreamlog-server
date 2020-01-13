const path = require("path");
const logger = require("../../src/logger");
const express = require("express");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sendEmails = require("../../src/nodemailer/emailer");
const DataService = require("../data-service");

const signup = express.Router();
const bodyParser = express.json();

signup
  .route("/signup")
  .get(bodyParser, (req, res, next) => {
    return res.status(400).send({
      error: { message: `you must login first` }
    });
  })
  .post(bodyParser, (req, res, next) => {
    const verification_code = randomstring.generate();
    const { name, email, password } = req.body;

    for (const i of ["name", "email", "password"]) {
      if (!req.body[i]) {
        logger.error(`${i} is required`);
        return res.status(400).send({
          error: { message: `${i} is required` }
        });
      }
    }

    const newUser = {
      name,
      email,
      password,
      verification_code
    };

    DataService.doesUserExist(req.app.get("db"), email).then(user => {
      if (user) {
        logger.error(`User with ${email} is already exist.`);
        return res.status(400).send({
          error: { message: `A user with the email ${email} already exists.` }
        });
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        newUser.password = hash;
        DataService.insertUser(req.app.get("db"), newUser)
          .then(user => {
            logger.info(`User ${name} created.`);
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `${user.id}`))
              .json(DataService.serializeUser(user));
          })
          .then(
            sendEmails.sendEmailInitialVerification({
              verification_code,
              email
            })
          )
          .catch(next);
      });
    });
  });

module.exports = signup;
