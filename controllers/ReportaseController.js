const { Router } = require("express");
const modules = require("../modules/reportase.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listReportase());
});

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listReportaseKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/:id_reportase", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getReportase(Number(req.params.id_reportase))
  );
});

app.delete("/:id_reportase", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteReportase(Number(req.params.id_reportase))
  );
});

module.exports = app;
