const express = require("express");
const routerHub = express.Router();

const signup = require("./routers/signup");
const verification = require("./routers/verification");
const login = require("./routers/login");
const userpage = require("./routers/userpage");
const dream = require("./routers/dream");

routerHub.use(signup);
routerHub.use(verification);
routerHub.use(login);
routerHub.use(userpage);
routerHub.use(dream);

module.exports = routerHub;