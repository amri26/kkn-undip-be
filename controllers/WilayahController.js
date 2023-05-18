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

app.get("/kecamatan/:id_kabupaten", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listKecamatan(Number(req.params.id_kabupaten))
    );
});

module.exports = app;
