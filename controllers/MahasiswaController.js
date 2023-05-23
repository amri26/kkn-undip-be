const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin, verifyMahasiswa } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema/:id_prodi", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listMahasiswa(Number(req.params.id_tema), req.params.id_prodi));
});

app.post("/daftar_lokasi", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.daftarLokasi(req.user.id, req.body));
});

app.post("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.addLRK(req.user.id, req.body));
});

app.post("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.addLPK(req.user.id, req.body));
});

app.post("/reportase", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.addReportase(req.user.id, req.body));
});

module.exports = app;
