const { Router } = require("express");
const modules = require("../modules/event.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listAllEvent());
});

app.get("/mahasiswa", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswaEvent());
});

app.get("/dosen", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listDosenEvent());
});

app.get("/bappeda", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listBappedaEvent());
});

app.get("/:id_event", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getEvent(Number(req.params.id_event))
  );
});

module.exports = app;
