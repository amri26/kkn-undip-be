const { Router } = require("express");
const modules = require("../modules/event.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listAllEvent());
});

app.get("/mahasiswa", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listEventMahasiswa());
});

app.get("/dosen", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listEventDosen());
});

app.get("/bappeda", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listEventBappeda());
});

app.get("/detail/:id_event", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getEvent(Number(req.params.id_event))
  );
});

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addEvent(req.body));
});

app.put("/:id_event", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editEvent(Number(req.params.id_event), req.body)
  );
});

app.delete("/:id_event", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteEvent(Number(req.params.id_event))
  );
});

module.exports = app;
