const { Router } = require("express");
const modules = require("../modules/proposal.modules");
const response = require("../helpers/response");
const {
    userSession,
    verifyDosen,
    verifyAdmin,
    verifyReviewer,
} = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyDosen, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addProposal(req.user.id, req.body)
    );
});

app.put(
    "/acc/reviewer/:id_proposal",
    userSession,
    verifyReviewer,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accProposalReviewer(Number(req.params.id_proposal))
        );
    }
);

app.put(
    "/dec/reviewer/:id_proposal",
    userSession,
    verifyReviewer,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decProposalReviewer(Number(req.params.id_proposal))
        );
    }
);

app.put(
    "/acc/admin/:id_proposal",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accProposalAdmin(Number(req.params.id_proposal))
        );
    }
);

app.put(
    "/dec/admin/:id_proposal",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decProposalAdmin(Number(req.params.id_proposal))
        );
    }
);

module.exports = app;
