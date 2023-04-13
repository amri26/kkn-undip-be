const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _potensi {
    listPotensi = async (body) => {
        try {
            const schema = Joi.object({
                id_periode: Joi.number().required(),
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

            const list = await prisma.potensi.findMany({
                where: {
                    id_periode: body.id_periode,
                    kecamatan: {
                        id_kabupaten: body.id_kabupaten,
                    },
                },
                include: {
                    kecamatan: {
                        select: {
                            nama: true,
                        },
                    },
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listPotensi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addPotensi = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_kecamatan: Joi.number().required(),
                id_periode: Joi.number().required(),
                potensi: Joi.string().required(),
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

            const checkBappeda = await prisma.bappeda.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_kabupaten: true,
                },
            });

            if (!checkBappeda) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: body.id_kecamatan,
                },
                select: {
                    id_kabupaten: true,
                },
            });

            if (checkBappeda.id_kabupaten !== checkKecamatan.id_kabupaten) {
                return {
                    status: false,
                    code: 401,
                    error: "You're not authorized",
                };
            }

            await prisma.potensi.create({
                data: {
                    id_kecamatan: body.id_kecamatan,
                    id_periode: body.id_periode,
                    potensi: body.potensi,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addPotensi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accPotensi = async (id_potensi) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_potensi);

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

            await prisma.potensi.update({
                where: {
                    id_potensi,
                },
                data: {
                    status: true,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("accPotensi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decPotensi = async (id_potensi) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_potensi);

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

            await prisma.potensi.update({
                where: {
                    id_potensi,
                },
                data: {
                    status: false,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("decPotensi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _potensi();
