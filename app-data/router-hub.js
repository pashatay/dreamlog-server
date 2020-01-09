const express = require("express");
const routerHub = express.Router();

const signup = require("./routers/signup");
const login = require("./routers/login");

routerHub.use(signup);
routerHub.use(login);

module.exports = routerHub;
