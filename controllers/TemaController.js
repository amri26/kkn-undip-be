const { Router } = require("express");
const modules = require("../modules/tema.modules");
const response = require("../helpers/response");
const { userSession, verifyDosen } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listTema());
});

app.get("/aktif", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listTemaActive());
});

app.get("/dosen", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(res, await modules.listTemaDosen(req.user.id));
});

app.get("/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.getTema(Number(req.params.id_tema)));
});

module.exports = app;
