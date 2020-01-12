const express = require("express");
const jwt = require("jsonwebtoken");
const logger = require("../../src/logger");
const { JWT_KEY } = require("../../src/config");
const DataService = require("../data-service");
const validateBearerToken = require("../../src/validate-token");

const dream = express.Router();
const bodyParser = express.json();

let userid = "";
let dreamid = "";

dream
  .route("/dreams/:dreamid")
  .all(bodyParser, validateBearerToken, (req, res, next) => {
    dreamid = req.params.dreamid;
    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if (err) {
        res.status(401).json({ error: `"token problem" ${req.token}` });
      } else {
        userid = authData.id;
        DataService.findUserSpecificDream(
          req.app.get("db"),
          userid,
          dreamid
        ).then(dream => {
          if (!dream[0]) {
            res.status(400).json({ error: `Dream is not found` });
          }
        });
      }
    });
    next();
  })
  .get((req, res, next) => {
    DataService.findUserSpecificDream(req.app.get("db"), userid, dreamid)
      .then(dream => {
        logger.info(`Dream is fetched`);
        res.status(201).json(dream.map(DataService.serializeDream));
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const { is_private } = req.body;
    DataService.changeDreamPrivacy(
      req.app.get("db"),
      userid,
      dreamid,
      is_private
    )
      .then(dream => {
        logger.info(`Dream is update`);
        res.status(200).send({ message: `Dream was updated` });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    DataService.deleteDream(req.app.get("db"), userid, dreamid)
      .then(dream => {
        logger.info(`Dream was deleted`);
        res.sendStatus(200);
      })
      .catch(next);
  });

module.exports = dream;
