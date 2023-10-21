const { Router } = require("express");
const modules = require("../modules/profile.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyMahasiswa,
  verifyDosen,
} = require("../helpers/middleware");

const app = Router();

app.get("/", async (req, res, next) => {
  response.sendResponse(res, await modules.getProfile());
});

app.put("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.editProfile(req.body));
});

module.exports = app;
