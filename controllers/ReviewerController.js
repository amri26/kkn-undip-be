const { Router } = require("express");
const modules = require("../modules/reviewer.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyReviewer,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listReviewer());
});

app.get("/:id_reviewer", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getReviewer(Number(req.params.id_reviewer))
  );
});

app.put("/evaluate", userSession, verifyReviewer, async (req, res, next) => {
  response.sendResponse(res, await modules.evaluateProposal(req.body));
});

module.exports = app;
