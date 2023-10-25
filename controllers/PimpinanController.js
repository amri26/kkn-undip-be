const { Router } = require("express");
const modules = require("../modules/pimpinan.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listPimpinan());
});

app.get(
  "/detail/:id_pimpinan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getPimpinan(Number(req.params.id_pimpinan))
    );
  }
);

app.post(
  "/import",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importPimpinan(req.file));
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addPimpinan(req.body));
});

app.put("/:id_pimpinan", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editPimpinan(Number(req.params.id_pimpinan), req.body)
  );
});

app.delete(
  "/:id_pimpinan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePimpinan(Number(req.params.id_pimpinan))
    );
  }
);

module.exports = app;
