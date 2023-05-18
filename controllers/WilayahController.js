const { Router } = require("express");
const modules = require("../modules/wilayah.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/kabupaten/:id_tema", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listKabupaten(Number(req.params.id_tema))
    );
});

app.get("/kecamatan", userSession, async (req, res, next) => {
    if (req.query.id_kabupaten) {
        response.sendResponse(
            res,
            await modules.listKecamatan(Number(req.query.id_kabupaten))
        );
    } else if (req.query.id_tema) {
        response.sendResponse(
            res,
            await modules.listKecamatanAll(Number(req.query.id_tema))
        );
    }
});

module.exports = app;
