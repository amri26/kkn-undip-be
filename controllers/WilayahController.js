const { Router } = require("express");
const modules = require("../modules/wilayah.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listKabupaten());
});

app.post("/kecamatan", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listKecamatan(req.body));
});

module.exports = app;
