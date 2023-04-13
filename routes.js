const AuthController = require("./controllers/AuthController");
const AdminController = require("./controllers/AdminController");
const DosenController = require("./controllers/DosenController");
const ProposalController = require("./controllers/ProposalController");
const BappedaController = require("./controllers/BappedaController");
const WilayahController = require("./controllers/WilayahController");
const PotensiController = require("./controllers/PotensiController");
const MahasiswaController = require("./controllers/MahasiswaController");
const LrkController = require("./controllers/LrkController");
const LpkController = require("./controllers/LpkController");

const _routes = [
    ["/login", AuthController],
    ["/admin", AdminController],
    ["/dosen", DosenController],
    ["/proposal", ProposalController],
    ["/bappeda", BappedaController],
    ["/wilayah", WilayahController],
    ["/potensi", PotensiController],
    ["/mahasiswa", MahasiswaController],
    ["/lrk", LrkController],
    ["/lpk", LpkController],
];

const routes = (app) => {
    _routes.forEach((route) => {
        const [url, controller] = route;
        app.use(`${url}`, controller);
    });
};

module.exports = routes;
