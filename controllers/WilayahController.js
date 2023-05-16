const { Router } = require("express");
const modules = require("../modules/wilayah.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listKabupaten());
});

app.get(
    "/kecamatan/:id_periode/:id_kabupaten?",
    userSession,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.listKecamatan(
                Number(req.params.id_periode),
                req.params.id_kabupaten
            )
        );
    }
);

module.exports = app;
