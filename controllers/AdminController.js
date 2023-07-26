const { Router } = require("express");
const modules = require("../modules/admin.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifySuperAdmin,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listAdmin());
});

app.get("/:id_admin", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getAdmin(Number(req.params.id_admin))
  );
});

app.put(
  "/proposal/acc/:id_proposal",
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
  "/proposal/dec/:id_proposal",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.decProposal(Number(req.params.id_proposal))
    );
  }
);

app.post("/event", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addEvent(req.body));
});

app.put(
  "/event/:id_event",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editEvent(Number(req.params.id_event), req.body)
    );
  }
);

app.delete(
  "/event/:id_event",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteEvent(Number(req.params.id_event))
    );
  }
);

app.post("/pengumuman", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addPengumuman(req.body));
});

app.put(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editPengumuman(Number(req.params.id_pengumuman), req.body)
    );
  }
);

app.delete(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePengumuman(Number(req.params.id_pengumuman))
    );
  }
);

module.exports = app;
