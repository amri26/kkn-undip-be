const { Router } = require("express");
const modules = require("../modules/nilai.modules");
const response = require("../helpers/response");
const { userSession, verifyDosen } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listNilaiKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/detail/:id_nilai", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getNilai(Number(req.params.id_nilai))
  );
});

app.put("/", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(res, await modules.editNilai(req.user.id, req.body));
});

app.put("/reset/:id_nilai", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.resetNlai(Number(req.params.id_nilai))
  );
});

app.get("/import/:id_kecamatan", userSession, async (req, res, next) => {
  await modules.downloadFormatImport(res, Number(req.params.id_kecamatan));
});

app.post(
  "/import",
  userSession,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importNilai(req.file));
  }
);

module.exports = app;
