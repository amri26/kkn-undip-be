const { Router } = require("express");
const modules = require("../modules/reviewer.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addReviewer(req.body));
});

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listReviewer());
});

module.exports = app;
