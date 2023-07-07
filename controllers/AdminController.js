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

app.put(
  "/tema/edit/:id_tema",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editTema(Number(req.params.id_tema), req.body)
    );
  }
);

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

app.get(
  "/halaman/:id_tema",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listHalaman(Number(req.params.id_tema))
    );
  }
);

app.post("/halaman", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addHalaman(req.body));
});

app.put(
  "/halaman/edit/:id_tema_halaman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editHalaman(Number(req.params.id_tema_halaman), req.body)
    );
  }
);

app.patch(
  "/halaman/:id_tema_halaman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.switchHalaman(Number(req.params.id_tema_halaman))
    );
  }
);

app.get(
  "/gelombang/:id_tema",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listGelombang(Number(req.params.id_tema))
    );
  }
);

app.get(
  "/gelombang/detail/:id_gelombang",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.getGelombang(Number(req.params.id_gelombang))
    );
  }
);

app.post("/gelombang", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addGelombang(req.body));
});

app.put(
  "/gelombang/edit/:id_gelombang",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editGelombang(Number(req.params.id_gelombang), req.body)
    );
  }
);

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

app.delete(
  "/mahasiswa/:id_mahasiswa",
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

app.delete(
  "/dosen/:id_dosen",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteDosen(Number(req.params.id_dosen))
    );
  }
);

app.post(
  "/korwil",
  userSession,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.addKorwil(req.file));
  }
);

app.post("/korwil/single", userSession, async (req, res, next) => {
  response.sendResponse(res, await modules.addKorwilSingle(req.body));
});

app.delete(
  "/korwil/:id_korwil",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteKorwil(Number(req.params.id_korwil))
    );
  }
);

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

app.delete(
  "/bappeda/:id_bappeda",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteBappeda(Number(req.params.id_bappeda))
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

app.delete(
  "/reviewer/:id_reviewer",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteReviewer(Number(req.params.id_reviewer))
    );
  }
);

app.post(
  "/pimpinan",
  userSession,
  verifyAdmin,
  upload.single("file"),
  async (req, res, next) => {
    response.sendResponse(res, await modules.addPimpinan(req.file));
  }
);

app.post(
  "/pimpinan/single",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(res, await modules.addPimpinanSingle(req.body));
  }
);

app.delete(
  "/pimpinan/:id_pimpinan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePimpinan(Number(req.params.id_pimpinan))
    );
  }
);

app.put(
  "/kecamatan/acc/:id_kecamatan",
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
