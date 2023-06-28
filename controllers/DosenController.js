const { Router } = require("express");
const modules = require("../modules/dosen.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin, verifyDosen } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listDosen());
});

app.get("/:id_kecamatan", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listDosenWilayah(Number(req.params.id_kecamatan)));
});

app.get("/mahasiswa/:id_kecamatan", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.listMahasiswa(req.user.id, Number(req.params.id_kecamatan)));
});

app.get("/proposal/:id_tema", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.listProposal(req.user.id, Number(req.params.id_tema)));
});

app.post("/proposal", userSession, verifyDosen, upload.single("file"), async (req, res, next) => {
    response.sendResponse(res, await modules.addProposal(req.file, req.user.id, req.body));
});

app.put("/mahasiswa/acc/:id_mahasiswa_kecamatan", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.accMahasiswa(req.user.id, Number(req.params.id_mahasiswa_kecamatan)));
});

app.put("/mahasiswa/dec/:id_mahasiswa_kecamatan", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.decMahasiswa(req.user.id, Number(req.params.id_mahasiswa_kecamatan)));
});

app.put("/laporan", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.evaluateLaporan(req.user.id, req.body));
});

app.get("/reportase/:id_kecamatan", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.listReportase(req.user.id, Number(req.params.id_kecamatan)));
});

app.put("/reportase", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(res, await modules.evaluateReportase(req.user.id, req.body));
});

module.exports = app;
