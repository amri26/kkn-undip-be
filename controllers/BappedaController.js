const { Router } = require("express");
const modules = require("../modules/bappeda.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyAdmin,
    verifyBappeda,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listBappeda());
});

app.post("/kabupaten", userSession, verifyBappeda, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addKabupaten(req.user.id, req.body)
    );
});

app.post("/kecamatan", userSession, verifyBappeda, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addKecamatan(req.user.id, req.body)
    );
});

module.exports = app;
