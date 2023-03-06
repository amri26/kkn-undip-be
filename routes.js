const AuthController = require("./controllers/AuthController");
const MahasiswaController = require("./controllers/MahasiswaController");
const LrkController = require("./controllers/LrkController");
const LpkController = require("./controllers/LpkController");

const _routes = [
    ["/login", AuthController],
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
