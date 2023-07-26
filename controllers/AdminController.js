const { Router } = require("express");
const modules = require("../modules/admin.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifySuperAdmin,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listAdmin());
});

app.get(
  "/detail/:id_admin",
  userSession,
  verifySuperAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getAdmin(Number(req.params.id_admin))
    );
  }
);

module.exports = app;
