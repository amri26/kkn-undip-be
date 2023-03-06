const { Router } = require("express");
const modules = require("../modules/lrk.modules");
const response = require("../helpers/response");
const { userSession, verifyMahasiswa } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.addLrk(req.user.id, req.body));
});

app.get("/", userSession, verifyMahasiswa, async (req, res, next) => {
    response.sendResponse(res, await modules.listLrk(req.user.id));
});

module.exports = app;
