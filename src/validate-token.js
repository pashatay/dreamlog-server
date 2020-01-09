const logger = require("./logger");

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  req.token = authToken.split(" ")[1];

  next();
}

module.exports = validateBearerToken;
