const AdminController = require("./controllers/AdminController");
const AuthController = require("./controllers/AuthController");
const BappedaController = require("./controllers/BappedaController");
const DokumenController = require("./controllers/DokumenController");
const DosenController = require("./controllers/DosenController");
const EventController = require("./controllers/EventController");
const ExcelController = require("./controllers/ExportToExcelController");
const FakultasController = require("./controllers/FakultasController");
const GelombangController = require("./controllers/GelombangController");
const HalamanController = require("./controllers/HalamanController");
const KabupatenController = require("./controllers/KabupatenController");
const KecamatanController = require("./controllers/KecamatanController");
const KorwilController = require("./controllers/KorwilController");
const LaporanController = require("./controllers/LaporanController");
const MahasiswaController = require("./controllers/MahasiswaController");
const NilaiController = require("./controllers/NilaiController");
const PendafataranController = require("./controllers/PendaftaranController");
const PengumumanController = require("./controllers/PengumumanController");
const PimpinanController = require("./controllers/PimpinanController");
const ProposalController = require("./controllers/ProposalController");
const ReportaseController = require("./controllers/ReportaseController");
const ReviewerController = require("./controllers/ReviewerController");
const SuperAdminController = require("./controllers/SuperAdminController");
const TemaController = require("./controllers/TemaController");
const TestController = require("./controllers/TestController");
const UserController = require("./controllers/UserController");
const WilayahController = require("./controllers/WilayahController");

const _routes = [
  ["/admin", AdminController],
  ["/auth", AuthController],
  ["/bappeda", BappedaController],
  ["/dokumen", DokumenController],
  ["/dosen", DosenController],
  ["/event", EventController],
  ["/excel", ExcelController],
  ["/fakultas", FakultasController],
  ["/gelombang", GelombangController],
  ["/halaman", HalamanController],
  ["/kabupaten", KabupatenController],
  ["/kecamatan", KecamatanController],
  ["/korwil", KorwilController],
  ["/laporan", LaporanController],
  ["/mahasiswa", MahasiswaController],
  ["/nilai", NilaiController],
  ["/pendaftaran", PendafataranController],
  ["/pengumuman", PengumumanController],
  ["/pimpinan", PimpinanController],
  ["/proposal", ProposalController],
  ["/reportase", ReportaseController],
  ["/reviewer", ReviewerController],
  ["/superadmin", SuperAdminController],
  ["/tema", TemaController],
  ["/test", TestController],
  ["/user", UserController],
  ["/wilayah", WilayahController],
];

const routes = (app) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(`${url}`, controller);
  });
};

module.exports = routes;
