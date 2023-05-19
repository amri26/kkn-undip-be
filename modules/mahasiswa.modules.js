const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _mahasiswa {
    listMahasiswa = async (id_tema, id_prodi) => {
        try {
            const body = {
                id_tema,
                id_prodi,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
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
                        id_tema: body.id_tema,
                        id_prodi: body.id_prodi,
                    },
                });
            } else {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_tema: body.id_tema,
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

    daftarLokasi = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_kecamatan: Joi.number().required(),
                id_gelombang: Joi.number().required(),
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
                    id_tema: true,
                },
            });

            if (!checkMahasiswa) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkGelombang = await prisma.gelombang.findUnique({
                where: {
                    id_gelombang: body.id_gelombang,
                },
                select: {
                    status: true,
                },
            });

            if (!checkGelombang.status) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Gelombang data is not activated",
                };
            }

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: body.id_kecamatan,
                },
                select: {
                    kabupaten: {
                        select: {
                            id_tema: true,
                        },
                    },
                },
            });

            if (checkMahasiswa.id_tema !== checkKecamatan.kabupaten.id_tema) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Tema data doesn't match",
                };
            }

            await prisma.mahasiswa_kecamatan.create({
                data: {
                    id_mahasiswa: checkMahasiswa.id_mahasiswa,
                    id_kecamatan: body.id_kecamatan,
                    id_gelombang: body.id_gelombang,
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
}

module.exports = new _mahasiswa();
