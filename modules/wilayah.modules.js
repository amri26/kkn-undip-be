const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _wilayah {
    listKabupaten = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

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

            const list = await prisma.kabupaten.findMany({
                where: {
                    id_tema,
                },
                include: {
                    _count: {
                        select: {
                            kecamatan: true,
                        },
                    },
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listKabupaten module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listKecamatanAll = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

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

            const list = await prisma.kabupaten.findMany({
                where: {
                    id_tema,
                },
                include: {
                    kecamatan: true,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listKecamatanAll module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listKecamatan = async (id_kabupaten) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_kabupaten);

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

            const list = await prisma.kecamatan.findMany({
                where: {
                    id_kabupaten,
                },
                include: {
                    _count: {
                        select: {
                            desa: true,
                        },
                    },
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listKecamatan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _wilayah();
