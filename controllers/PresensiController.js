const { Router } = require("express");
const modules = require("../modules/presensi.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listPresensi());
});

app.get("/tema/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listPresensiTema(Number(req.params.id_tema))
  );
});

app.post("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.addPresensi(Number(req.params.id_tema))
  );
});

module.exports = app;
