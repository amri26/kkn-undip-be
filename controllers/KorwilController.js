const { Router } = require("express");
const modules = require("../modules/korwil.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listKorwil());
});

app.get("/detail/:id_korwil", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getKorwil(Number(req.params.id_korwil))
  );
});

app.post(
  "/import",
  userSession,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importKorwil(req.file));
  }
);

app.post("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.addKorwil(req.body));
});

app.put("/:id_korwil", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editKorwil(Number(req.params.id_korwil), req.body)
  );
});

app.delete("/:id_korwil", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteKorwil(Number(req.params.id_korwil))
  );
});

module.exports = app;
