const { Router } = require("express");
const modules = require("../modules/halaman.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

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
