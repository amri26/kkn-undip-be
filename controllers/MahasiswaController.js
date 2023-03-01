const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addMahasiswa(req.body));
});

app.get(
    "/:id_periode/:jurusan",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.listMahasiswa(
                Number(req.params.id_periode),
                req.params.jurusan
            )
        );
    }
);

module.exports = app;
