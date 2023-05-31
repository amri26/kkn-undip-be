const { Router } = require("express");
const modules = require("../modules/laporan.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporan());
});

app.get("/:id_laporan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getLaporan(Number(req.params.id_laporan))
  );
});

module.exports = app;
