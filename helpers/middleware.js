const prisma = require("../helpers/database");
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

            const user = await prisma.user.findFirst({
                where: {
                    id_user: decoded.id,
                },
                select: {
                    id_user: true,
                    username: true,
                    tipe: true,
                },
            });

            if (user) {
                req.user = {
                    id: user.id_user,
                    username: user.username,
                    tipe: user.tipe,
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

const verifyAdmin = async (req, res, next) => {
    try {
        if (req.user.tipe === 0) {
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
        if (req.user.tipe === 1) {
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

module.exports = { userSession, verifyAdmin, verifyMahasiswa };
