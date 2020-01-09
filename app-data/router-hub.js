const express = require("express");
const routerHub = express.Router();

const signup = require("./routers/signup");
const login = require("./routers/login");
const userpage = require("./routers/userpage");

routerHub.use(signup);
routerHub.use(login);
routerHub.use(userpage);

module.exports = routerHub;
