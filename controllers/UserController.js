const { Router } = require("express");
const modules = require("../modules/user.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listUser());
});

app.get("/detail", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.getUser(req.user.id, req.user.role));
});

app.put("/", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editUser(req.user.id, req.user.role, req.body)
  );
});

module.exports = app;
