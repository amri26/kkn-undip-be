const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _wilayah {
    listKabupaten = async () => {
        try {
            const list = await prisma.kabupaten.findMany({
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

    listKecamatan = async (id_tema, id_kabupaten) => {
        try {
            if (id_kabupaten !== undefined) {
                const body = {
                    id_tema,
                    id_kabupaten: Number(id_kabupaten),
                };

                const schema = Joi.object({
                    id_tema: Joi.number().required(),
                    id_kabupaten: Joi.number().required(),
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

                const list = await prisma.kecamatan.findMany({
                    where: {
                        id_tema: body.id_tema,
                        id_kabupaten: body.id_kabupaten,
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
            } else {
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

                const list = await prisma.kecamatan.findMany({
                    where: {
                        id_tema,
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
            }
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
