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
                        id_tema: tema.map((item) => item.kecamatan.kabupaten.tema.id_tema),
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
                                            tema: true,
                                        },
                                    },
                                },
                            },
                        },
                    });

                    get = {
                        ...get,
                        id_tema: tema?.kecamatan.kabupaten.tema.id_tema,
                        tema: tema?.kecamatan.kabupaten.tema,
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

    editUser = async (id_user, role, body) => {
        try {
            body = {
                id_user,
                role,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                role: Joi.string().required(),
                nama: Joi.string(),
                jenis_kelamin: Joi.number(),
                ttl: Joi.string(),
                no_hp: Joi.string(),
                alamat: Joi.string(),
                riwayat_penyakit: Joi.string(),
                nama_ortu: Joi.string(),
                no_hp_ortu: Joi.string(),
                alamat_ortu: Joi.string(),
                nama_cp_urgent: Joi.string(),
                no_hp_cp_urgent: Joi.string(),
                alamat_cp_urgent: Joi.string(),
                hubungan: Joi.string(),
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

            switch (role) {
                case Role.ADMIN:
                    await prisma.admin.update({
                        where: {
                            id_user,
                        },
                        data: {
                            nama: body.nama,
                        },
                    });

                    break;
                case Role.BAPPEDA:
                    await prisma.bappeda.update({
                        where: {
                            id_user,
                        },
                        data: {
                            nama: body.nama,
                        },
                    });

                    break;
                case Role.REVIEWER:
                    await prisma.reviewer.update({
                        where: {
                            id_user,
                        },
                        data: {
                            nama: body.nama,
                        },
                    });

                    break;
                case Role.DOSEN:
                    await prisma.dosen.update({
                        where: {
                            id_user,
                        },
                        data: {
                            nama: body.nama,
                        },
                    });

                    break;
                case Role.MAHASISWA:
                    await prisma.mahasiswa.update({
                        where: {
                            id_user,
                        },
                        data: {
                            nama: body.nama,
                            jenis_kelamin: body.jenis_kelamin,
                            ttl: body.ttl,
                            no_hp: body.no_hp,
                            alamat: body.alamat,
                            riwayat_penyakit: body.riwayat_penyakit,
                            nama_ortu: body.nama_ortu,
                            no_hp_ortu: body.no_hp_ortu,
                            alamat_ortu: body.alamat_ortu,
                            nama_cp_urgent: body.nama_cp_urgent,
                            no_hp_cp_urgent: body.no_hp_cp_urgent,
                            alamat_cp_urgent: body.alamat_cp_urgent,
                            hubungan: body.hubungan,
                        },
                    });

                    break;
                default:
                    break;
            }

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("editUser auth module Error: ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _auth();
