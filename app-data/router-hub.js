const express = require("express");
const routerHub = express.Router();

const signup = require("./routers/signup");
const verification = require("./routers/verification");
const login = require("./routers/login");
const userpage = require("./routers/userpage");
const dream = require("./routers/dream");
const dreamblog = require("./routers/dreamblog");
const resetpassword = require("./routers/resetpassword");

routerHub.use(signup);
routerHub.use(verification);
routerHub.use(login);
routerHub.use(userpage);
routerHub.use(dream);
routerHub.use(dreamblog);
routerHub.use(resetpassword);

module.exports = routerHub;
