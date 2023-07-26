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

app.get("/:id_admin", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getAdmin(Number(req.params.id_admin))
  );
});

app.post("/pengumuman", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addPengumuman(req.body));
});

app.put(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editPengumuman(Number(req.params.id_pengumuman), req.body)
    );
  }
);

app.delete(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePengumuman(Number(req.params.id_pengumuman))
    );
  }
);

module.exports = app;
