const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyMahasiswa,
  verifyDosen,
  isActive,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswa());
});

app.get("/import", userSession, async (req, res, next) => {
  await modules.downloadFormatImport(res);
});

app.get("/tema/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listMahasiswaTema(Number(req.params.id_tema))
  );
});

app.get("/unregistered", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswaUnregistered());
});

app.get("/registered", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswaRegistered());
});

app.get("/accepted", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswaAccepted());
});

app.get("/registered/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listMahasiswaRegisteredByKecamatan(
      Number(req.params.id_kecamatan)
    )
  );
});

app.get("/accepted/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listMahasiswaAcceptedByKecamatan(
      Number(req.params.id_kecamatan)
    )
  );
});

app.get("/:id_kecamatan", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listMahasiswaDosen(
      req.user.id,
      Number(req.params.id_kecamatan)
    )
  );
});

app.get("/detail/:id_mahasiswa", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getMahasiswa(Number(req.params.id_mahasiswa))
  );
});

app.post(
  "/import",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.importMahasiswa(req.file));
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addMahasiswa(req.body));
});

app.put("/:id_mahasiswa", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editMahasiswa(Number(req.params.id_mahasiswa), req.body)
  );
});

app.delete(
  "/:id_mahasiswa",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteMahasiswa(Number(req.params.id_mahasiswa))
    );
  }
);

app.post(
  "/surat_pernyataan",
  userSession,
  verifyMahasiswa,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.addSuratPernyataan(req.file, Number(req.user.id))
    );
  }
);

app.post(
  "/khs",
  userSession,
  verifyMahasiswa,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.addKHS(req.file, Number(req.user.id))
    );
  }
);

app.post(
  "/foto",
  userSession,
  verifyMahasiswa,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.addFoto(req.file, Number(req.user.id))
    );
  }
);

module.exports = app;
