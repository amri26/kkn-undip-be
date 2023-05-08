const { Router } = require("express");
const modules = require("../modules/potensi.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/:id_periode", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listPotensi(Number(req.params.id_periode))
    );
});

app.put(
    "/acc/:id_kecamatan",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accPotensi(Number(req.params.id_kecamatan))
        );
    }
);

app.put(
    "/dec/:id_kecamatan",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decPotensi(Number(req.params.id_kecamatan))
        );
    }
);

module.exports = app;
