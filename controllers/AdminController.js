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

app.get("/user", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listUser());
});

app.get("/tema", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listTema());
});

app.post("/tema", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addTema(req.body));
});

app.patch(
    "/tema/:id_tema",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.switchTema(Number(req.params.id_tema))
        );
    }
);

app.get("/halaman", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listHalaman());
});

app.post("/halaman", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addHalaman(req.body));
});

app.patch(
    "/halaman/:id_halaman",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.switchHalaman(Number(req.params.id_halaman))
        );
    }
);

app.get("/gelombang", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.listGelombang());
});

app.post("/gelombang", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addGelombang(req.body));
});

app.patch(
    "/gelombang/:id_gelombang",
    userSession,
    verifyAdmin,
    async (req, res, next) => {
        response.sendResponse(
            res,
            await modules.switchGelombang(Number(req.params.id_gelombang))
        );
    }
);

app.post(
    "/mahasiswa",
    userSession,
    verifyAdmin,
    upload.single("file"),
    async (req, res, next) => {
        response.sendResponse(res, await modules.addMahasiswa(req.file));
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
    userSession,
    verifyAdmin,
    upload.single("file"),
    async (req, res, next) => {
        response.sendResponse(res, await modules.addDosen(req.file));
    }
);

app.post("/dosen/single", userSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await modules.addDosenSingle(req.body));
});

app.post(
    "/bappeda",
    userSession,
    verifyAdmin,
    upload.single("file"),
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
    userSession,
    verifyAdmin,
    upload.single("file"),
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
