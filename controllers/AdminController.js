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

app.get("/:id_admin", userSession, verifySuperAdmin, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getAdmin(Number(req.params.id_admin))
  );
});

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

app.put(
  "/mahasiswa/:id_mahasiswa",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editMahasiswa(Number(req.params.id_mahasiswa), req.body)
    );
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

app.put(
  "/dosen/:id_dosen",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editDosen(Number(req.params.id_dosen), req.body)
    );
  }
);

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

app.put(
  "/korwil/:id_korwil",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editKorwil(Number(req.params.id_korwil), req.body)
    );
  }
);

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

app.put(
  "/bappeda/:id_bappeda",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editBappeda(Number(req.params.id_bappeda), req.body)
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

app.put(
  "/reviewer/:id_reviewer",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editReviewer(Number(req.params.id_reviewer), req.body)
    );
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

app.put(
  "/pimpinan/:id_pimpinan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editPimpinan(Number(req.params.id_pimpinan), req.body)
    );
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

app.delete(
  "/kecamatan/:id_kecamatan",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteKecamatan(Number(req.params.id_kecamatan))
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

app.post("/event", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addEvent(req.body));
});

app.put(
  "/event/:id_event",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editEvent(Number(req.params.id_event), req.body)
    );
  }
);

app.delete(
  "/event/:id_event",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deleteEvent(Number(req.params.id_event))
    );
  }
);

app.post("/pengumuman", userSession, verifyAdmin, async (req, res, next) => {
  response.sendResponse(res, await modules.addPengumuman(req.body));
});

app.put(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.editPengumuman(Number(req.params.id_pengumuman), req.body)
    );
  }
);

app.delete(
  "/pengumuman/:id_pengumuman",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.deletePengumuman(Number(req.params.id_pengumuman))
    );
  }
);

module.exports = app;
