const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

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

module.exports = app;
