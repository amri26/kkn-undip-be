const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyAdmin,
    verifyMahasiswa,
    verifyDosen,
} = require("../helpers/middleware");

const multer = require("multer");
const upload = multer();

const app = Router();

app.post(
    "/",
    upload.single("file"),
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.addMahasiswa(req.file, req.body)
        );
    }
);

app.get(
    "/:id_periode/:id_prodi",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.listMahasiswa(
                Number(req.params.id_periode),
                req.params.id_prodi
            )
        );
    }
);

app.post(
    "/daftar_lokasi",
    userSession,
    verifyMahasiswa,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.daftarLokasi(req.user.id, req.body)
        );
    }
);

app.put(
    "/acc/:id_mahasiswa_proposal",
    userSession,
    verifyDosen,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accMahasiswa(
                req.user.id,
                Number(req.params.id_mahasiswa_proposal)
            )
        );
    }
);

app.put(
    "/dec/:id_mahasiswa_proposal",
    userSession,
    verifyDosen,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decMahasiswa(
                req.user.id,
                Number(req.params.id_mahasiswa_proposal)
            )
        );
    }
);

module.exports = app;
