const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _admin {
    listAdmin = async () => {
        try {
            const list = await prisma.admin.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listAdmin module error ", error);

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
                        prodi: e.prodi,
                        id_user: addUser.id_user,
                        id_periode: Number(body.id_periode),
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

    addDosen = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nip: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nip,
                    password: bcrypt.hashSync(body.nip, 10),
                    role: Role.DOSEN,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.dosen.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nip: body.nip,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found",
                    };
                }
            }

            console.error("addDosen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addBappeda = async (created_by, body) => {
        try {
            body = {
                created_by,
                ...body,
            };

            const schema = Joi.object({
                nama: Joi.string().required(),
                nisn: Joi.string().required(),
                kabupaten: Joi.string().required(),
                nama_pj: Joi.string().required(),
                created_by: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nisn,
                    password: bcrypt.hashSync(body.nisn, 10),
                    role: "BAPPEDA",
                },
                select: {
                    id_user: true,
                },
            });

            const addKabupaten = await prisma.kabupaten.create({
                data: {
                    nama: body.kabupaten,
                },
                select: {
                    id_kabupaten: true,
                },
            });

            await prisma.bappeda.create({
                data: {
                    id_user: addUser.id_user,
                    id_kabupaten: addKabupaten.id_kabupaten,
                    nama: body.nama,
                    nisn: body.nisn,
                    nama_pj: body.nama_pj,
                    created_by,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found",
                    };
                }
            }

            console.error("addBappeda module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addReviewer = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nip: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nip,
                    password: bcrypt.hashSync(body.nip, 10),
                    role: Role.REVIEWER,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.reviewer.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nip: body.nip,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found",
                    };
                }
            }

            console.error("addReviewer module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accKecamatan = async (id_kecamatan) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_kecamatan);

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

            await prisma.kecamatan.update({
                where: {
                    id_kecamatan,
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
            console.error("accKecamatan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decKecamatan = async (id_kecamatan) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_kecamatan);

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

            await prisma.kecamatan.update({
                where: {
                    id_kecamatan,
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
            console.error("decKecamatan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accProposal = async (id_proposal) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_proposal);

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

            await prisma.proposal.update({
                where: {
                    id_proposal,
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
            console.error("accProposal module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decProposal = async (id_proposal) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_proposal);

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

            await prisma.proposal.update({
                where: {
                    id_proposal,
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
            console.error("decProposal module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _admin();
