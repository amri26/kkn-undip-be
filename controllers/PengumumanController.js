const { Router } = require("express");
const modules = require("../modules/pengumuman.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listAllPengumuman());
});

app.get("/mahasiswa", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswaPengumuman());
});

app.get("/dosen", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listDosenPengumuman());
});

app.get("/bappeda", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listBappedaPengumuman());
});

app.get("/:id_pengumuman", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getPengumuman(Number(req.params.id_pengumuman))
  );
});

module.exports = app;
