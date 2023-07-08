const { Router } = require("express");
const modules = require("../modules/superadmin.modules");
const response = require("../helpers/response");
const { userSession, verifySuperAdmin } = require("../helpers/middleware");

const app = Router();

app.post("/admin", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addAdmin(req.body));
});

app.put(
  "/admin/:id_admin",
  userSession,
  verifySuperAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editAdmin(Number(req.params.id_admin), req.body)
    );
  }
);

module.exports = app;
