const { Router } = require("express");
const modules = require("../modules/exportToExcel.modules");
const response = require("../helpers/response");
const { userSession } = require("../helpers/middleware");

const app = Router();

app.get(
  "/pendaftaran/mahasiswa/:id_kecamatan",
  userSession,
  async (req, res, next) => {
    await modules.exportDataPendaftaranMahasiswa(
      res,
      Number(req.params.id_kecamatan)
    );
  }
);

module.exports = app;
