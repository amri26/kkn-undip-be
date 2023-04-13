const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _lrk {
    listLrk = async (id_user) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_user);

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

            const check = await prisma.mahasiswa.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_mahasiswa: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const list = await prisma.lrk.findMany({
                where: {
                    id_mahasiswa: check.id_mahasiswa,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listLrk module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addLrk = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                potensi: Joi.string().required(),
                program: Joi.string().required(),
                sasaran: Joi.string().required(),
                metode: Joi.string().required(),
                luaran: Joi.string().required(),
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

            const check = await prisma.mahasiswa.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_mahasiswa: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            await prisma.lrk.create({
                data: {
                    id_mahasiswa: check.id_mahasiswa,
                    potensi: body.potensi,
                    program: body.program,
                    sasaran: body.sasaran,
                    metode: body.metode,
                    luaran: body.luaran,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addLrk module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _lrk();
