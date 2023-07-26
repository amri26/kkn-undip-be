const { Router } = require("express");
const modules = require("../modules/pengumuman.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

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

app.get("/detail/:id_pengumuman", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getPengumuman(Number(req.params.id_pengumuman))
  );
});

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addPengumuman(req.body));
});

app.put("/:id_pengumuman", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editPengumuman(Number(req.params.id_pengumuman), req.body)
  );
});

app.delete(
  "/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePengumuman(Number(req.params.id_pengumuman))
    );
  }
);

module.exports = app;
