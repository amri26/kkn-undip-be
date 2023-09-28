const { Router } = require("express");
const modules = require("../modules/desa.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyBappeda,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listDesa());
});

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listDesaKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/detail/:id_desa", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.getDesa(Number(req.params.id_desa)));
});

app.post("/", userSession, verifyBappeda, async (req, res, next) => {
  response.sendResponse(res, await modules.addDesa(req.body));
});

app.put("/:id_desa", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editDesa(Number(req.params.id_desa), req.body)
  );
});

app.delete("/:id_desa", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteDesa(Number(req.params.id_desa))
  );
});

module.exports = app;
