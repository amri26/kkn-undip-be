const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _gelombang {
    listGelombang = async (id_tema, id_halaman) => {
        try {
            const body = {
                id_tema,
                id_halaman,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
                id_halaman: Joi.number().required(),
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

            const list = await prisma.gelombang.findMany({
                where: {
                    tema_halaman: {
                        id_tema: body.id_tema,
                        id_halaman: body.id_halaman,
                    },
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listGelombangMahasiswa = async (id_mahasiswa) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_mahasiswa);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.mahasiswa_kecamatan.findMany({
                where: {
                    id_mahasiswa,
                },
                include: {
                    kecamatan: true,
                    gelombang: true,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listGelombangMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _gelombang();
