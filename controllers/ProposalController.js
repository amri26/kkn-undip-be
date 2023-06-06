const { Router } = require("express");
const modules = require("../modules/proposal.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.listProposal(Number(req.params.id_tema)));
});

app.get("/detail/:id_proposal", userSession, async (req, res, next) => {
    response.sendResponse(res, await modules.getProposal(Number(req.params.id_proposal)));
});

module.exports = app;
