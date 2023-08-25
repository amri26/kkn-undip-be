const { Router } = require("express");
const modules = require("../modules/superadmin.modules");
const response = require("../helpers/response");
const { userSession, verifySuperAdmin } = require("../helpers/middleware");

const app = Router();

module.exports = app;
