const { Router } = require("express");
const modules = require("../modules/presensi.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  await modules.updateStatusPresensi();
  response.sendResponse(res, await modules.listPresensi());
});

app.get("/tema/:id_tema", userSession, async (req, res, next) => {
  await modules.updateStatusPresensi();
  response.sendResponse(
    res,
    await modules.listPresensiTema(Number(req.params.id_tema))
  );
});

app.get(
  "/riwayat/mahasiswa",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    await modules.updateStatusPresensi();
    response.sendResponse(
      res,
      await modules.listRiwayatPresensiMahasiswa(Number(req.user.id))
    );
  }
);

app.get("/riwayat/:id_mahasiswa/:tgl", userSession, async (req, res, next) => {
  await modules.updateStatusPresensi();
  response.sendResponse(
    res,
    await modules.getRiwayatPresensi(
      Number(req.params.id_mahasiswa),
      req.params.tgl
    )
  );
});

app.post("/:id_tema", userSession, async (req, res, next) => {
  await modules.updateStatusPresensi();
  response.sendResponse(
    res,
    await modules.addPresensi(Number(req.params.id_tema))
  );
});

app.post(
  "/submit/:id_tema",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    await modules.updateStatusPresensi();
    response.sendResponse(
      res,
      await modules.submitPresensi(
        Number(req.user.id),
        Number(req.params.id_tema),
        req.body
      )
    );
  }
);

app.put("/status", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.updateStatusPresensi());
});

module.exports = app;
