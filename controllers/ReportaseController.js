const { Router } = require("express");
const modules = require("../modules/reportase.modules");
const response = require("../helpers/response");
const {
  userSession,
  isActive,
  verifyDosen,
  verifyMahasiswa,
} = require("../helpers/middleware");

const app = Router();

app.get("/", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.listReportase());
});

app.get(
  "/dosen/:id_kecamatan",
  userSession,
  verifyDosen,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listReportaseDosen(
        req.user.id,
        Number(req.params.id_kecamatan)
      )
    );
  }
);

app.get("/mahasiswa", userSession, verifyMahasiswa, async (req, res, next) => {
  response.sendResponse(res, await modules.listReportaseMahasiswa(req.user.id));
});

app.get("/kecamatan/:id_kecamatan", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listReportaseKecamatan(Number(req.params.id_kecamatan))
  );
});

app.get("/detail/:id_reportase", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getReportase(Number(req.params.id_reportase))
  );
});

app.post("/", userSession, verifyMahasiswa, async (req, res, next) => {
  const check = await isActive(
    req.body.id_tema,
    Number(process.env.MAHASISWA_KELOLA_REPORTASE)
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
  "/:id_reportase",
  userSession,
  verifyMahasiswa,
  async (req, res, next) => {
    const check = await isActive(
      req.body.id_tema,
      Number(process.env.MAHASISWA_KELOLA_REPORTASE)
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

app.delete("/:id_reportase", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteReportase(Number(req.params.id_reportase))
  );
});

app.put("/evaluate", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.evaluateReportase(req.user.id, req.body)
  );
});

module.exports = app;
