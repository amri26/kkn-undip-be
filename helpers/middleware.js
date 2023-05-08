const { prisma, Role } = require("../helpers/database");
const config = require("../config/app.config.json");
const jwt = require("jsonwebtoken");

const userSession = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, config.jwt.secret);

            const user = await prisma.user.findUnique({
                where: {
                    id_user: decoded.id,
                },
                select: {
                    id_user: true,
                    username: true,
                    role: true,
                },
            });

            if (user) {
                req.user = {
                    id: user.id_user,
                    username: user.username,
                    role: user.role,
                };

                next();
            } else {
                res.status(401).send({ message: "Not authorized" });
            }
        } catch (error) {
            res.status(401).send({
                message: "Not authorized Error. Token Expired.",
            });
        }
    }

    if (!token) {
        res.status(401).send({
            message: "Not authenticated, no token",
        });
    }
};

const verifySuperAdmin = async (req, res, next) => {
    try {
        if (req.user.role === Role.SUPERADMIN) {
            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        if (req.user.role === Role.ADMIN) {
            const check = await prisma.admin.findFirst({
                where: {
                    id_user: req.user.id,
                },
                select: {
                    nama: true,
                },
            });

            req.user.nama = check.nama;

            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

const verifyMahasiswa = async (req, res, next) => {
    try {
        if (req.user.role === Role.MAHASISWA) {
            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

const verifyBappeda = async (req, res, next) => {
    try {
        if (req.user.role === Role.BAPPEDA) {
            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

const verifyDosen = async (req, res, next) => {
    try {
        if (req.user.role === Role.DOSEN) {
            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

const verifyReviewer = async (req, res, next) => {
    try {
        if (req.user.role === Role.REVIEWER) {
            next();
        } else {
            res.status(401).send({
                status: false,
                error: "You're not authorized",
            });
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            error,
        });
    }
};

module.exports = {
    userSession,
    verifySuperAdmin,
    verifyAdmin,
    verifyMahasiswa,
    verifyBappeda,
    verifyDosen,
    verifyReviewer,
};
