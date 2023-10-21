const { Router } = require("express");
const modules = require("../modules/struktur.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyReviewer,
} = require("../helpers/middleware");

const app = Router();

app.get("/", async (req, res, next) => {
  response.sendResponse(res, await modules.getStruktur());
});

app.put("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.editStruktur(req.body));
});

module.exports = app;
