const { prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _mahasiswa {
    listMahasiswa = async (id_periode, id_prodi) => {
        try {
            const body = {
                id_periode,
                id_prodi,
            };

            const schema = Joi.object({
                id_periode: Joi.number().required(),
                id_prodi: Joi.string().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            let list = {};

            if (body.id_prodi !== "all") {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_periode: body.id_periode,
                        id_prodi: body.id_prodi,
                    },
                });
            } else {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_periode: body.id_periode,
                    },
                });
            }

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addMahasiswa = async (file, body) => {
        try {
            const schema = Joi.object({
                id_periode: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const result = excelToJson({
                source: file.buffer,
                sheets: ["mahasiswa"],
                columnToKey: {
                    A: "nama",
                    B: "nim",
                    C: "prodi",
                },
            });

            for (let i = 0; i < result.mahasiswa.length; i++) {
                const e = result.mahasiswa[i];

                const check = await prisma.user.findUnique({
                    where: {
                        username: String(e.nim),
                    },
                    select: {
                        id_user: true,
                        username: true,
                    },
                });

                if (check) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIM " + check.username,
                    };
                }

                const addUser = await prisma.user.create({
                    data: {
                        username: String(e.nim),
                        password: bcrypt.hashSync(String(e.nim), 10),
                        role: Role.MAHASISWA,
                    },
                    select: {
                        id_user: true,
                    },
                });

                await prisma.mahasiswa.create({
                    data: {
                        nama: e.nama,
                        nim: String(e.nim),
                        id_user: addUser.id_user,
                        id_periode: Number(body.id_periode),
                        id_prodi: e.prodi,
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    daftarLokasi = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_proposal: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkMahasiswa = await prisma.mahasiswa.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_mahasiswa: true,
                },
            });

            if (!checkMahasiswa) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkProposal = await prisma.proposal.findUnique({
                where: {
                    id_proposal: body.id_proposal,
                },
                select: {
                    status: true,
                },
            });

            if (checkProposal.status !== 2) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_proposal.create({
                data: {
                    id_mahasiswa: checkMahasiswa.id_mahasiswa,
                    id_proposal: body.id_proposal,
                    status: 0,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("daftarLokasi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accMahasiswa = async (id_user, id_mahasiswa_proposal) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_proposal,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_proposal: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkDosen = await prisma.dosen.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_dosen: true,
                },
            });

            if (!checkDosen) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkMahasiswaProposal =
                await prisma.mahasiswa_proposal.findUnique({
                    where: {
                        id_mahasiswa_proposal,
                    },
                    select: {
                        proposal: {
                            select: {
                                id_dosen: true,
                            },
                        },
                    },
                });

            if (
                checkDosen.id_dosen !== checkMahasiswaProposal.proposal.id_dosen
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_proposal.update({
                where: {
                    id_mahasiswa_proposal,
                },
                data: {
                    status: 1,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("accMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decMahasiswa = async (id_user, id_mahasiswa_proposal) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_proposal,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_proposal: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkDosen = await prisma.dosen.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_dosen: true,
                },
            });

            if (!checkDosen) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkMahasiswaProposal =
                await prisma.mahasiswa_proposal.findUnique({
                    where: {
                        id_mahasiswa_proposal,
                    },
                    select: {
                        proposal: {
                            select: {
                                id_dosen: true,
                            },
                        },
                    },
                });

            if (
                checkDosen.id_dosen !== checkMahasiswaProposal.proposal.id_dosen
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_proposal.update({
                where: {
                    id_mahasiswa_proposal,
                },
                data: {
                    status: -1,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("decMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _mahasiswa();
