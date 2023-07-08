const { Router } = require("express");
const modules = require("../modules/pimpinan.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listPimpinan());
});

app.get("/:id_pimpinan", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getPimpinan(Number(req.params.id_pimpinan))
  );
});

module.exports = app;
