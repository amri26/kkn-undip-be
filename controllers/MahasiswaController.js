const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin, verifyMahasiswa, isActive } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema/:id_prodi", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listMahasiswa(Number(req.params.id_tema), req.params.id_prodi));
});

app.post("/daftar_lokasi", userSession, verifyMahasiswa, async (req, res, next) => {
    const check = await isActive(req.body.id_tema, Number(process.env.MAHASISWA_DAFTAR_LOKASI));

    if (!check.status) {
        response.sendResponse(res, check);
    } else {
        req.body.id_tema_halaman = check.data.id_tema_halaman;
        response.sendResponse(res, await modules.daftarLokasi(req.user.id, req.body));
    }
});

app.post("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
    const check = await isActive(req.body.id_tema, Number(process.env.MAHASISWA_LRK));

    if (!check.status) {
        response.sendResponse(res, check);
    } else {
        response.sendResponse(res, await modules.addLRK(req.user.id, req.body));
    }
});

app.post("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
    const check = await isActive(req.body.id_tema, Number(process.env.MAHASISWA_LPK));

    if (!check.status) {
        response.sendResponse(res, check);
    } else {
        response.sendResponse(res, await modules.addLPK(req.user.id, req.body));
    }
});

app.post("/reportase", userSession, verifyMahasiswa, async (req, res, next) => {
    const check = await isActive(req.body.id_tema, Number(process.env.MAHASISWA_REPORTASE));

    if (!check.status) {
        response.sendResponse(res, check);
    } else {
        response.sendResponse(res, await modules.addReportase(req.user.id, req.body));
    }
});

module.exports = app;
