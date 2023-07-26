const { Router } = require("express");
const modules = require("../modules/gelombang.modules");
const response = require("../helpers/response");
const { userSession, verifyAdmin } = require("../helpers/middleware");

const app = Router();

app.get("/:id_tema", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listGelombang(Number(req.params.id_tema))
  );
});

app.get(
  "/halaman/:id_tema/:id_halaman",
  userSession,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listGelombangHalaman(
        Number(req.params.id_tema),
        Number(req.params.id_halaman)
      )
    );
  }
);

app.get(
  "/dosen/:id_tema/:id_halaman/:id_dosen",
  userSession,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listGelombangDosen(
        Number(req.params.id_tema),
        Number(req.params.id_halaman),
        Number(req.params.id_dosen)
      )
    );
  }
);

app.get(
  "/mahasiswa/:id_tema/:id_halaman/:id_mahasiswa",
  userSession,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listGelombangMahasiswa(
        Number(req.params.id_tema),
        Number(req.params.id_halaman),
        Number(req.params.id_mahasiswa)
      )
    );
  }
);

app.get(
  "/detail/:id_gelombang",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getGelombang(Number(req.params.id_gelombang))
    );
  }
);

app.post("/", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addGelombang(req.body));
});

app.put("/:id_gelombang", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.editGelombang(Number(req.params.id_gelombang), req.body)
  );
});

app.patch(
  "/:id_gelombang",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.switchGelombang(Number(req.params.id_gelombang))
    );
  }
);

app.delete(
  "/:id_gelombang",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteGelombang(Number(req.params.id_gelombang))
    );
  }
);

module.exports = app;
