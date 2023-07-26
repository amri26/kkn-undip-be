const { Router } = require("express");
const modules = require("../modules/laporan.modules");
const response = require("../helpers/response");
const {
  userSession,
  isActive,
  verifyDosen,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporan());
});

app.get("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporanType(req.user.id, "lrk"));
});

app.get("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporanType(req.user.id, "lpk"));
});

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listLaporanKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/detail/:id_laporan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getLaporan(Number(req.params.id_laporan))
  );
});

app.post("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_KELOLA_LRK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.addLRK(req.user.id, req.body));
  }
});

app.put("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_KELOLA_LRK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.editLRK(req.user.id, req.body));
  }
});

app.post("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_KELOLA_LPK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.addLPK(req.user.id, req.body));
  }
});

app.delete("/:id_laporan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteLaporan(Number(req.params.id_laporan))
  );
});

app.put("/laporan", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.evaluateLaporan(req.user.id, req.body)
  );
});

module.exports = app;
