const { Router } = require("express");
const modules = require("../modules/berita.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listBerita());
});

app.get("/detail/:id_berita", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getBerita(parseInt(req.params.id_berita))
  );
});

app.post(
  "/",
  userSession,
  upload.single("thumbnail"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.addBerita(parseInt(req.user.id), req.body, req.file)
    );
  }
);

app.put(
  "/:id_berita",
  userSession,
  upload.single("thumbnail"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editBerita(
        parseInt(req.user.id),
        parseInt(req.params.id_berita),
        req.body,
        req.file
      )
    );
  }
);

app.delete("/:id_berita", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteBerita(
      parseInt(req.user.id),
      parseInt(req.params.id_berita)
    )
  );
});
module.exports = app;
