const { Router } = require("express");
const modules = require("../modules/tema.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listTema());
});

module.exports = app;
