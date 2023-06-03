const { Router } = require("express");
const modules = require("../modules/dokumen.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/:id_dokumen", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getDokumen(Number(req.params.id_dokumen))
  );
});

app.get("/embed/:id_dokumen", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getEmbedLink(Number(req.params.id_dokumen))
  );
});

module.exports = app;
