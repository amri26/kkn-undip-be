const { Router } = require("express");
const modules = require("../modules/kecamatan.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyBappeda,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listKecamatan());
});

app.get("/kabupaten/:id_kabupaten", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listKecamatanKabupaten(Number(req.params.id_kabupaten))
  );
});

app.get("/detail/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/mahasiswa", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.getKecamatanMahasiswa(req.user.id));
});

app.post("/", userSession, verifyBappeda, async (req, res, next) => {
  response.sendResponse(res, await modules.addKecamatan(req.user.id, req.body));
});

app.put("/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editKecamatan(Number(req.params.id_kecamatan), req.body)
  );
});

app.put(
  "/acc/:id_kecamatan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.accKecamatan(Number(req.params.id_kecamatan), req.body)
    );
  }
);

app.put(
  "/dec/:id_kecamatan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.decKecamatan(Number(req.params.id_kecamatan))
    );
  }
);

app.delete("/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteKecamatan(Number(req.params.id_kecamatan))
  );
});

module.exports = app;
