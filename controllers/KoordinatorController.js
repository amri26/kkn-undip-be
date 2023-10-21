const { Router } = require("express");
const modules = require("../modules/koordinator.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listKoordinator());
});

app.get(
  "/detail/:id_koordinator",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getKoordinator(parseInt(req.params.id_koordinator))
    );
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addKoordinator(req.body));
});

app.put(
  "/:id_koordinator",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editKoordinator(
        parseInt(req.params.id_koordinator),
        req.body
      )
    );
  }
);

app.delete(
  "/:id_koordinator",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteKoordinator(parseInt(req.params.id_koordinator))
    );
  }
);

module.exports = app;
