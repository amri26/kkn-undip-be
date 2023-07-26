const AuthController = require("./controllers/AuthController");
const SuperAdminController = require("./controllers/SuperAdminController");
const AdminController = require("./controllers/AdminController");
const DosenController = require("./controllers/DosenController");
const ProposalController = require("./controllers/ProposalController");
const BappedaController = require("./controllers/BappedaController");
const WilayahController = require("./controllers/WilayahController");
const MahasiswaController = require("./controllers/MahasiswaController");
const ReviewerController = require("./controllers/ReviewerController");
const PimpinanController = require("./controllers/PimpinanController");
const TemaController = require("./controllers/TemaController");
const DokumenController = require("./controllers/DokumenController");
const GelombangController = require("./controllers/GelombangController");
const HalamanController = require("./controllers/HalamanController");
const LaporanController = require("./controllers/LaporanController");
const ReportaseController = require("./controllers/ReportaseController");
const KabupatenController = require("./controllers/KabupatenController");
const KecamatanController = require("./controllers/KecamatanController");
const KorwilController = require("./controllers/KorwilController");
const FakultasController = require("./controllers/FakultasController");
const NilaiController = require("./controllers/NilaiController");
const EventController = require("./controllers/EventController");
const PengumumanController = require("./controllers/PengumumanController");
const TestController = require("./controllers/TestController");
const UserController = require("./controllers/UserController");

const _routes = [
  ["/auth", AuthController],
  ["/superadmin", SuperAdminController],
  ["/admin", AdminController],
  ["/dosen", DosenController],
  ["/proposal", ProposalController],
  ["/bappeda", BappedaController],
  ["/wilayah", WilayahController],
  ["/mahasiswa", MahasiswaController],
  ["/reviewer", ReviewerController],
  ["/pimpinan", PimpinanController],
  ["/tema", TemaController],
  ["/dokumen", DokumenController],
  ["/gelombang", GelombangController],
  ["/halaman", HalamanController],
  ["/laporan", LaporanController],
  ["/reportase", ReportaseController],
  ["/kabupaten", KabupatenController],
  ["/kecamatan", KecamatanController],
  ["/korwil", KorwilController],
  ["/fakultas", FakultasController],
  ["/nilai", NilaiController],
  ["/event", EventController],
  ["/pengumuman", PengumumanController],
  ["/test", TestController],
  ["/user", UserController],
];

const routes = (app) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(`${url}`, controller);
  });
};

module.exports = routes;
