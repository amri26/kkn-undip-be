const { Router } = require("express");
const modules = require("../modules/admin.modules");
const response = require("../helpers/response");
const { userSession, verifySuperAdmin } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifySuperAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addAdmin(req.body));
});

app.get("/", userSession, verifySuperAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listAdmin());
});

module.exports = app;
