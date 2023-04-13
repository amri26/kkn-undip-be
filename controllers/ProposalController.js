const { Router } = require("express");
const modules = require("../modules/proposal.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyDosen,
    verifyAdmin,
} = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addProposal(req.user.id, req.body)
    );
});

app.put(
    "/acc/:id_proposal",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accProposal(Number(req.params.id_proposal))
        );
    }
);

app.put(
    "/dec/:id_proposal",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decProposal(Number(req.params.id_proposal))
        );
    }
);

module.exports = app;
