const { Router } = require("express");
const modules = require("../modules/lpk.modules");
const response = require("../helpers/response");
const { userSession, verifyMahasiswa } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.addLpk(req.user.id, req.body));
});

app.get("/", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.listLpk(req.user.id));
});

module.exports = app;
