const { Router } = require("express");
const modules = require("../modules/dosen.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyDosen,
  isActive,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listDosen());
});

app.get("/tema/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listDosenTema(Number(req.params.id_tema))
  );
});

app.get(
  "/detail/:id_dosen",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getDosen(Number(req.params.id_dosen))
    );
  }
);

app.post(
  "/import",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importDosen(req.file));
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addDosen(req.body));
});

app.put("/:id_dosen", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editDosen(Number(req.params.id_dosen), req.body)
  );
});

app.delete("/:id_dosen", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteDosen(Number(req.params.id_dosen))
  );
});

app.get("/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listDosenWilayah(Number(req.params.id_kecamatan))
  );
});

module.exports = app;
