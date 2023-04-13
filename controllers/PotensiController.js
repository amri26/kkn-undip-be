const { Router } = require("express");
const modules = require("../modules/potensi.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyBappeda,
    verifyAdmin,
} = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyBappeda, async (req, res, next) => {
    response.sendResponse(res, await modules.addPotensi(req.user.id, req.body));
});

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listPotensi(req.body));
});

app.put(
    "/acc/:id_potensi",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accPotensi(Number(req.params.id_potensi))
        );
    }
);

app.put(
    "/dec/:id_potensi",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decPotensi(Number(req.params.id_potensi))
        );
    }
);

module.exports = app;
