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

app.post(
    "/mahasiswa",
    upload.single("file"),
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.addMahasiswa(req.file, req.body)
        );
    }
);

app.post("/dosen", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addDosen(req.body));
});

app.post("/bappeda", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(
        res,
        await modules.addBappeda(req.user.nama, req.body)
    );
});

app.post("/reviewer", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addReviewer(req.body));
});

app.put(
    "/kecamatan/acc/:id_kecamatan",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.accKecamatan(Number(req.params.id_kecamatan))
        );
    }
);

app.put(
    "/kecamatan/dec/:id_kecamatan",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.decKecamatan(Number(req.params.id_kecamatan))
        );
    }
);

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

module.exports = app;
