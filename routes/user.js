const express = require("express");
const routes = express.Router();
const user = require("../controller/user");
const jwtauth = require("../config/middleware");

routes.post("/login", user.login);

routes.use(jwtauth);
routes.get("/profile", user.profile);
routes.post("/signup", user.signup);

module.exports = routes;
