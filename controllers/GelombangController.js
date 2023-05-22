const { Router } = require("express");
const modules = require("../modules/gelombang.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get("/:id_halaman", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listGelombang(Number(req.params.id_halaman))
    );
});

module.exports = app;
