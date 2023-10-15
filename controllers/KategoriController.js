const { Router } = require("express");
const modules = require("../modules/kategori.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listKategori());
});

app.get("/detail/:id", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getKategori(parseInt(req.params.id))
  );
});

app.post("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.addKategori(req.body));
});

app.put("/:id", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editKategori(parseInt(req.params.id), req.body)
  );
});

app.delete("/:id", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteKategori(parseInt(req.params.id))
  );
});

module.exports = app;
