const { Router } = require("express");
const modules = require("../modules/korwil.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listKorwil());
});

app.get("/:id_korwil", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getKorwil(Number(req.params.id_korwil))
  );
});

module.exports = app;
