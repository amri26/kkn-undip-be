const { Router } = require("express");
const modules = require("../modules/mahasiswa.modules");
const response = require("../helpers/response");
const {
  userSession,
  verifyAdmin,
  verifyMahasiswa,
  isActive,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.listMahasiswa());
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

app.post(
  "/daftar_lokasi",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    const check = await isActive(
      req.body.id_tema,
      Number(process.env.MAHASISWA_DAFTAR_LOKASI)
    );

    if (!check.status) {
      response.sendResponse(res, check);
    } else {
      req.body.id_tema_halaman = check.data.id_tema_halaman;
      response.sendResponse(
        res,
        await modules.daftarLokasi(req.user.id, req.body)
      );
    }
  }
);

app.get("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporan(req.user.id, "lrk"));
});

app.post("/lrk", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_ADD_LRK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.addLRK(req.user.id, req.body));
  }
});

app.put("/lrk/edit", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_ADD_LRK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.editLRK(req.user.id, req.body));
  }
});

app.get("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listLaporan(req.user.id, "lpk"));
});

app.post("/lpk", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_EDIT_LPK)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(res, await modules.addLPK(req.user.id, req.body));
  }
});

app.get("/reportase", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listReportase(req.user.id));
});

app.post("/reportase", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_REPORTASE)
  );

  if (!check.status) {
    response.sendResponse(res, check);
  } else {
    response.sendResponse(
      res,
      await modules.addReportase(req.user.id, req.body)
    );
  }
});

app.put(
  "/reportase/:id_reportase",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    const check = await isActive(
      req.body.id_tema,
      Number(process.env.MAHASISWA_REPORTASE)
    );

    if (!check.status) {
      response.sendResponse(res, check);
    } else {
      response.sendResponse(
        res,
        await modules.editReportase(
          req.user.id,
          Number(req.params.id_reportase),
          req.body
        )
      );
    }
  }
);

module.exports = app;
