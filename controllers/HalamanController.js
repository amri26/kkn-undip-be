const { Router } = require("express");
const modules = require("../modules/halaman.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listHalaman(Number(req.params.id_tema))
  );
});

app.get("/detail/:id_tema_halaman", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getHalaman(Number(req.params.id_tema_halaman))
  );
});

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addHalaman(req.body));
});

app.put(
  "/:id_tema_halaman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editHalaman(Number(req.params.id_tema_halaman), req.body)
    );
  }
);

app.patch(
  "/:id_tema_halaman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.switchHalaman(Number(req.params.id_tema_halaman))
    );
  }
);

app.get("/:id_tema/:id_halaman", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.checkHalaman(
      Number(req.params.id_tema),
      Number(req.params.id_halaman)
    )
  );
});

module.exports = app;
