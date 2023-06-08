const { Router } = require("express");
const modules = require("../modules/reportase.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listReportase());
});

app.get("/:id_reportase", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getReportase(Number(req.params.id_reportase))
  );
});

module.exports = app;
