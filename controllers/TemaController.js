const { Router } = require("express");
const modules = require("../modules/tema.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyDosen,
  verifyAdmin,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listTema());
});

app.get("/active", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listTemaActive());
});

app.get("/dosen", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(res, await modules.listTemaDosen(req.user.id));
});

app.get("/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.getTema(Number(req.params.id_tema)));
});

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addTema(req.body));
});

app.put("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editTema(Number(req.params.id_tema), req.body)
  );
});

app.patch("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.switchTema(Number(req.params.id_tema))
  );
});

app.delete("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteTema(Number(req.params.id_tema))
  );
});

module.exports = app;
