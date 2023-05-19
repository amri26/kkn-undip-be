const { Router } = require("express");
const modules = require("../modules/wilayah.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listWilayah(Number(req.params.id_tema))
    );
});

app.get("/:id_tema/:id_bappeda", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listMyWilayah(
            Number(req.params.id_tema),
            Number(req.params.id_bappeda)
        )
    );
});

module.exports = app;
