const { Router } = require("express");
const modules = require("../modules/potensi.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema", userSession, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.listPotensi(Number(req.params.id_tema))
    );
});

module.exports = app;
