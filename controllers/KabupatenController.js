const { Router } = require("express");
const modules = require("../modules/kabupaten.modules");
const response = require("../helpers/response");
const { userSession, verifyBappeda } = require("../helpers/middleware");

const app = Router();

app.get("/tema/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listKabupatenTema(Number(req.params.id_tema))
  );
});

app.get("/bappeda", userSession, verifyBappeda, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listKabupatenBappeda(Number(req.user.id))
  );
});

app.get(
  "/bappeda/tema/:id_tema/:id_bappeda",
  userSession,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listKabupatenBappedaTema(
        Number(req.params.id_tema),
        Number(req.params.id_bappeda)
      )
    );
  }
);

app.post("/", userSession, verifyBappeda, async (req, res, next) => {
  response.sendResponse(res, await modules.addKabupaten(req.user.id, req.body));
});

module.exports = app;
