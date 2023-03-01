const AuthController = require("./controllers/AuthController");
const MahasiswaController = require("./controllers/MahasiswaController");

const _routes = [
    ["/login", AuthController],
    ["/mahasiswa", MahasiswaController],
];

const routes = (app) => {
    _routes.forEach((route) => {
        const [url, controller] = route;
        app.use(`${url}`, controller);
    });
};

module.exports = routes;
