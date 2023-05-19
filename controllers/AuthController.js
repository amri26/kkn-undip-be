const { Router } = require("express");
const modules = require("../modules/auth.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.post("/", async (req, res, next) => {
    response.sendResponse(res, await modules.login(req.body));
});

app.get("/", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.getUser(req.user.id, req.user.role)
    );
});

module.exports = app;
