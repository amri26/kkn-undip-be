const { Router } = require("express");
const modules = require("../modules/presensi.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/jadwal", userSession, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(res, await modules.listJadwalPresensi());
});

app.get("/jadwal/tema/:id_tema", userSession, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(
    res,
    await modules.listJadwalPresensiTema(Number(req.params.id_tema))
  );
});

app.get("/mahasiswa", userSession, verifyMahasiswa, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(
    res,
    await modules.listPresensiMahasiswa(Number(req.user.id))
  );
});

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(
    res,
    await modules.listPresensiKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/detail/:id_mahasiswa/:tgl", userSession, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(
    res,
    await modules.getPresensi(Number(req.params.id_mahasiswa), req.params.tgl)
  );
});

app.post("/jadwal", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addJadwalPresensi(req.body));
  await modules.updateStatusJadwalPresensi();
});

app.post("/jadwal/:id_tema", userSession, async (req, res, next) => {
  await modules.updateStatusJadwalPresensi();
  response.sendResponse(
    res,
    await modules.setupJadwalPresensiTema(Number(req.params.id_tema))
  );
});

app.post(
  "/submit/:id_tema",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    await modules.updateStatusJadwalPresensi();
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

app.put("/:id_riwayat_presensi", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editPresensi(Number(req.params.id_riwayat_presensi), req.body)
  );
  await modules.updateStatusJadwalPresensi();
});

app.put("/jadwal/status", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.updateStatusJadwalPresensi());
});

app.delete("/jadwal/:id_presensi", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteJadwalPresensi(Number(req.params.id_presensi))
  );
  await modules.updateStatusJadwalPresensi();
});

app.delete("/:id_riwayat_presensi", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deletePresensi(Number(req.params.id_riwayat_presensi))
  );
  await modules.updateStatusJadwalPresensi();
});

module.exports = app;
