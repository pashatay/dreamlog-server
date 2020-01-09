const logger = require("./logger");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("./config");
let userid = "";

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  req.token = authToken.split(" ")[1];

  jwt.verify(req.token, JWT_KEY, (err, authData) => {
    if (err) {
      res.status(401).json({ error: `"token problem" ${req.token}` });
    } else {
      userid = authData.id;

      //do i need to return
      return userid;
    }
  });
  console.log(userid);
  next();
}

module.exports = validateBearerToken;
