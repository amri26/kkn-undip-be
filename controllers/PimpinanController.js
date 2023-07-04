const { Router } = require("express");
const modules = require("../modules/pimpinan.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listPimpinan());
});

module.exports = app;
