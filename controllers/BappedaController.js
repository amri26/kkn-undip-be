const { Router } = require("express");
const modules = require("../modules/bappeda.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyBappeda,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listBappeda());
});

app.get(
  "/detail/:id_bappeda",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getBappeda(Number(req.params.id_bappeda))
    );
  }
);

app.post(
  "/import",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.importBappeda(req.user.nama, req.file)
    );
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addBappeda(req.user.nama, req.body));
});

app.put("/:id_bappeda", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editBappeda(Number(req.params.id_bappeda), req.body)
  );
});

app.delete("/:id_bappeda", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteBappeda(Number(req.params.id_bappeda))
  );
});

app.get(
  "/kabupaten/list",
  userSession,
  verifyBappeda,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listKabupatenBappeda(Number(req.user.id))
    );
  }
);

app.post("/kabupaten", userSession, verifyBappeda, async (req, res, next) => {
  response.sendResponse(res, await modules.addKabupaten(req.user.id, req.body));
});

module.exports = app;
