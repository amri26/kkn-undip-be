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

app.post(
    "/mahasiswa/single",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(res, await modules.addMahasiswaSingle(req.body));
    }
);

app.post(
    "/dosen",
    upload.single("file"),
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(res, await modules.addDosen(req.file));
    }
);

app.post("/dosen/single", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addDosenSingle(req.body));
});

app.post(
    "/bappeda",
    upload.single("file"),
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.addBappeda(req.user.nama, req.file)
        );
    }
);

app.post(
    "/bappeda/single",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.addBappedaSingle(req.user.nama, req.body)
        );
    }
);

app.post(
    "/reviewer",
    upload.single("file"),
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(res, await modules.addReviewer(req.file));
    }
);

app.post(
    "/reviewer/single",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(res, await modules.addReviewerSingle(req.body));
    }
);

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
