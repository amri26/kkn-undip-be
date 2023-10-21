const AdminController = require("./controllers/AdminController");
const AuthController = require("./controllers/AuthController");
const BappedaController = require("./controllers/BappedaController");
const BeritaController = require("./controllers/BeritaController");
const DesaController = require("./controllers/DesaController");
const DokumenController = require("./controllers/DokumenController");
const DosenController = require("./controllers/DosenController");
const EventController = require("./controllers/EventController");
const ExcelController = require("./controllers/ExportToExcelController");
const FakultasController = require("./controllers/FakultasController");
const GelombangController = require("./controllers/GelombangController");
const HalamanController = require("./controllers/HalamanController");
const KabupatenController = require("./controllers/KabupatenController");
const KategoriController = require("./controllers/KategoriController");
const KecamatanController = require("./controllers/KecamatanController");
const KorwilController = require("./controllers/KorwilController");
const LaporanController = require("./controllers/LaporanController");
const MahasiswaController = require("./controllers/MahasiswaController");
const NilaiController = require("./controllers/NilaiController");
const PendafataranController = require("./controllers/PendaftaranController");
const PengumumanController = require("./controllers/PengumumanController");
const PimpinanController = require("./controllers/PimpinanController");
const PresensiController = require("./controllers/PresensiController");
const ProfileController = require("./controllers/ProfileController");
const ProposalController = require("./controllers/ProposalController");
const ReportaseController = require("./controllers/ReportaseController");
const ReviewerController = require("./controllers/ReviewerController");
const SuperAdminController = require("./controllers/SuperAdminController");
const StrukturController = require("./controllers/StrukturController");
const TemaController = require("./controllers/TemaController");
const TestController = require("./controllers/TestController");
const UserController = require("./controllers/UserController");
const WilayahController = require("./controllers/WilayahController");

const _routes = [
  ["/admin", AdminController],
  ["/auth", AuthController],
  ["/bappeda", BappedaController],
  ["/berita", BeritaController],
  ["/desa", DesaController],
  ["/dokumen", DokumenController],
  ["/dosen", DosenController],
  ["/event", EventController],
  ["/excel", ExcelController],
  ["/fakultas", FakultasController],
  ["/gelombang", GelombangController],
  ["/halaman", HalamanController],
  ["/kabupaten", KabupatenController],
  ["/kategori", KategoriController],
  ["/kecamatan", KecamatanController],
  ["/korwil", KorwilController],
  ["/laporan", LaporanController],
  ["/mahasiswa", MahasiswaController],
  ["/nilai", NilaiController],
  ["/pendaftaran", PendafataranController],
  ["/pengumuman", PengumumanController],
  ["/pimpinan", PimpinanController],
  ["/presensi", PresensiController],
  ["/profile", ProfileController],
  ["/proposal", ProposalController],
  ["/reportase", ReportaseController],
  ["/reviewer", ReviewerController],
  ["/superadmin", SuperAdminController],
  ["/struktur", StrukturController],
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
