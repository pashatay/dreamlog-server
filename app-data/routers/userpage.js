const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const logger = require("../../src/logger");
const { JWT_KEY } = require("../../src/config");
const DataService = require("../data-service");
const validateBearerToken = require("../../src/validate-token");
const sendEmails = require("../../src/nodemailer/emailer");

const userPage = express.Router();
const bodyParser = express.json();
let userid = "";

userPage
  .route("/userpage")
  .all(bodyParser, validateBearerToken, (req, res, next) => {
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        userid = authData.id;
      }
    });
    next();
  })
  .get((req, res, next) => {
    DataService.findUserDreams(req.app.get("db"), userid)
      .then(dreams => {
        logger.info(`Dreams list fetched`);
        res.status(201).json(dreams.map(DataService.serializeDream));
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const {
      title,
      dream_date,
      dream_type,
      hours_slept,
      info,
      is_private
    } = req.body;
    const newDream = {
      title,
      dream_date,
      dream_type,
      hours_slept,
      info,
      is_private,
      userid
    };
    DataService.insertDream(req.app.get("db"), newDream)
      .then(dream => {
        logger.info(`New dream ${title} was created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${dream.id}`))
          .json(DataService.serializeDream(dream));
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    let { email, password } = req.body;
    if (!password) {
      const verification_code = randomstring.generate();
      DataService.doesUserExist(req.app.get("db"), email).then(user => {
        if (user) {
          logger.error(`User with ${email} is already exist!${user}`);
          return res.status(400).send({
            error: {
              message: `A user with the email ${email} already exists!`
            }
          });
        } else {
          DataService.changeUserEmail(
            req.app.get("db"),
            userid,
            email,
            verification_code
          )
            .then(user => {
              logger.info(`Users email was updated.`);
              res.status(201).send({
                message: {
                  message: `Almost done! Please check your inbox for the link to verify your new email.`
                }
              });
            })
            .then(sendEmails.sendEmailChangeEmail({ verification_code, email }))
            .catch(next);
        }
      });
    } else if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        password = hash;
        DataService.changeUserPassword(req.app.get("db"), userid, password)
          .then(user => {
            logger.info(`Users password was updated.`);
            res.status(201).send({
              message: {
                message: `Your password was updated. You can login now with the new password.`
              }
            });
          })
          .catch(next);
      });
    }
  })
  .delete((req, res, next) => {
    DataService.deleteUser(req.app.get("db"), userid)
      .then(user => {
        logger.info(`your page was deleted`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userPage;
