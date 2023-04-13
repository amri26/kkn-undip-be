const { Router } = require("express");
const modules = require("../modules/bappeda.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addBappeda(req.user.nama, req.body)
    );
});

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listBappeda());
});

module.exports = app;
