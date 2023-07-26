const { Router } = require("express");
const modules = require("../modules/reviewer.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyReviewer,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listReviewer());
});

app.get(
  "/detail/:id_reviewer",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getReviewer(Number(req.params.id_reviewer))
    );
  }
);

app.post(
  "/import",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importReviewer(req.file));
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addReviewer(req.body));
});

app.put("/:id_reviewer", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editReviewer(Number(req.params.id_reviewer), req.body)
  );
});

app.delete(
  "/:id_reviewer",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteReviewer(Number(req.params.id_reviewer))
    );
  }
);

app.put("/evaluate", userSession, verifyReviewer, async (req, res, next) => {
  response.sendResponse(res, await modules.evaluateProposal(req.body));
});

module.exports = app;
