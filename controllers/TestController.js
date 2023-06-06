const { Router } = require("express");
const modules = require("../modules/test.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/:id_kecamatan", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listMahasiswa(Number(req.params.id_kecamatan)));
});

module.exports = app;
