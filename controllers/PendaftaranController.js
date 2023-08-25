const { Router } = require("express");
const modules = require("../modules/pendaftaran.modules");
const response = require("../helpers/response");
const {
  userSession,
  isActive,
  verifyDosen,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.post("/", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    Number(req.body.id_tema),
    Number(process.env.MAHASISWA_DAFTAR_LOKASI)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    req.body.id_tema_halaman = check.data.id_tema_halaman;
    response.sendResponse(
      res,
      await modules.addPendaftaran(req.user.id, req.body)
    );
  }
});

app.put(
  "/acc/:id_mahasiswa_kecamatan",
  userSession,
  verifyDosen,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.accPendaftaran(
        req.user.id,
        Number(req.params.id_mahasiswa_kecamatan)
      )
    );
  }
);

app.put(
  "/dec/:id_mahasiswa_kecamatan",
  userSession,
  verifyDosen,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.decPendaftaran(
        req.user.id,
        Number(req.params.id_mahasiswa_kecamatan)
      )
    );
  }
);

app.delete("/:id_mahasiswa_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deletePendaftaran(
      req.user.id,
      Number(req.params.id_mahasiswa_kecamatan)
    )
  );
});

module.exports = app;
