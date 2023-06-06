const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _test {
    listMahasiswa = async (id_kecamatan) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_kecamatan);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const get = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan,
                },
                select: {
                    nama: true,
                    kabupaten: {
                        select: {
                            nama: true,
                        },
                    },
                },
            });

            const list = await prisma.mahasiswa_kecamatan_active.findMany({
                where: {
                    id_kecamatan,
                },
                select: {
                    mahasiswa: {
                        include: {
                            prodi: {
                                select: {
                                    nama: true,
                                    fakultas: {
                                        select: {
                                            nama: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return {
                status: true,
                data: { kecamatan: get, list },
            };
        } catch (error) {
            console.error("listTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _test();
