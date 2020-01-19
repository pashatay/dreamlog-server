const express = require("express");
const logger = require("../../src/logger");
const DataService = require("../data-service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmails = require("../../src/nodemailer/emailer");

const resetpassword = express.Router();
const bodyParser = express.json();
let jwtKey = "";
let email = "";
resetpassword
  .route(`/resetpassword/:token`)
  .post(bodyParser, (req, res, next) => {
    email = req.body.email;
    DataService.findUserPassword(req.app.get("db"), email).then(user => {
      jwtKey = user.password;
    });
    DataService.doesUserExist(req.app.get("db"), email)
      .then(user => {
        if (!user) {
          res.status(400).send({ error: { message: "Email wasn't found." } });
        } else {
          const token = jwt.sign(
            {
              email,
              id: user.id
            },
            jwtKey
          );
          sendEmails.sendEmailResetPassword({ token, email });
          res.status(201).send({
            token,
            message: "We sent you a reset link. Please check your email."
          });
        }
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    let { password } = req.body;
    const { token } = req.params;
    jwt.verify(token, jwtKey, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${token}` });
      } else {
        const userid = authData.id;

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
                message: `Your password was updated. You can login now with the new password.`
              });
            })
            .catch(next);
        });
        DataService.findUserPassword(req.app.get("db"), email).then(user => {
          jwtKey = user.password;
        });
      }
    });
  });

module.exports = resetpassword;
