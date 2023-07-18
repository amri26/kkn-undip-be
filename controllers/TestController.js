const { Router } = require("express");
const modules = require("../modules/test.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/:id_kecamatan", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listMahasiswa(Number(req.params.id_kecamatan)));
});

app.post("/mhs/:id_kecamatan/:id_gelombang", userSession, upload.single("file"), async (req, res, next) => {
    response.sendResponse(res, await modules.addMhs(req.file, Number(req.params.id_kecamatan), Number(req.params.id_gelombang)));
});

app.post("/dsn/:id_gelombang", userSession, upload.single("file"), async (req, res, next) => {
    response.sendResponse(res, await modules.addDsn(req.file, Number(req.params.id_gelombang)));
});

module.exports = app;
