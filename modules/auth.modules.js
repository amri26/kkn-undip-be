const { prisma, Role } = require("../helpers/database");
const config = require("../config/app.config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

class _auth {
    login = async (body) => {
        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkUser = await prisma.user.findUnique({
                where: {
                    username: body.username,
                },
                select: {
                    id_user: true,
                    username: true,
                    password: true,
                    role: true,
                },
            });

            if (!checkUser) {
                return {
                    status: false,
                    code: 404,
                    error: "Sorry, user not found",
                };
            }

            const checkPassword = bcrypt.compareSync(body.password, checkUser.password);

            if (!checkPassword) {
                return {
                    status: false,
                    code: 401,
                    error: "Sorry, password not match",
                };
            }

            const payload = {
                id: checkUser.id_user,
                username: checkUser.username,
                role: checkUser.role,
            };

            const { secret, expired } = config.jwt;

            const token = jwt.sign(payload, secret, {
                expiresIn: String(expired),
            });
            const expiresAt = new Date(Date.now() + expired);

            return {
                status: true,
                code: 201,
                data: {
                    token,
                    expiresAt,
                },
            };
        } catch (error) {
            console.error("login auth module Error: ", error);

            return {
                status: false,
                error,
            };
        }
    };

    getUser = async (id_user, role) => {
        try {
            let get = {};
            let tema;
            switch (role) {
                case Role.ADMIN:
                    get = await prisma.admin.findUnique({
                        where: {
                            id_user,
                        },
                    });
                    break;
                case Role.BAPPEDA:
                    get = await prisma.bappeda.findUnique({
                        where: {
                            id_user,
                        },
                    });
                    break;
                case Role.REVIEWER:
                    get = await prisma.reviewer.findUnique({
                        where: {
                            id_user,
                        },
                    });
                    break;
                case Role.DOSEN:
                    get = await prisma.dosen.findUnique({
                        where: {
                            id_user,
                        },
                    });

                    tema = await prisma.proposal.findMany({
                        where: {
                            id_dosen: get.id_dosen,
                        },
                        select: {
                            kecamatan: {
                                select: {
                                    kabupaten: {
                                        select: {
                                            tema: {
                                                select: {
                                                    id_tema: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });

                    get = {
                        ...get,
                        id_tema: tema?.kecamatan.kabupaten.tema.id_tema,
                    };

                    break;
                case Role.MAHASISWA:
                    get = await prisma.mahasiswa.findUnique({
                        where: {
                            id_user,
                        },
                    });

                    tema = await prisma.mahasiswa_kecamatan_active.findUnique({
                        where: {
                            id_mahasiswa: get.id_mahasiswa,
                        },
                        select: {
                            kecamatan: {
                                select: {
                                    kabupaten: {
                                        select: {
                                            tema: {
                                                select: {
                                                    id_tema: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });

                    get = {
                        ...get,
                        id_tema: tema?.kecamatan.kabupaten.tema.id_tema,
                    };

                    break;

                default:
                    get = {
                        nama: "Super Administrator",
                    };
                    break;
            }

            return {
                status: true,
                data: get,
            };
        } catch (error) {
            console.error("getUser auth module Error: ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _auth();
