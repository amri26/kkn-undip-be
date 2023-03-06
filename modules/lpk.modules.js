const prisma = require("../helpers/database");
const Joi = require("joi");

class _lpk {
    listLpk = async (id_user) => {
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

            const list = await prisma.lpk.findMany({
                where: {
                    id_mahasiswa: check.id_mahasiswa,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listLpk module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addLpk = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_lrk: Joi.number().required(),
                metode: Joi.string().required(),
                pelaksanaan: Joi.string().required(),
                capaian: Joi.string().required(),
                hambatan: Joi.string().required(),
                kelanjutan: Joi.string().required(),
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

            const checkMhs = await prisma.mahasiswa.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_mahasiswa: true,
                },
            });

            if (!checkMhs) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkLrk = await prisma.lrk.findUnique({
                where: {
                    id_lrk: body.id_lrk,
                },
                select: {
                    id_mahasiswa: true,
                },
            });

            if (!checkLrk || checkMhs.id_mahasiswa !== checkLrk.id_mahasiswa) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.lpk.create({
                data: {
                    id_mahasiswa: checkMhs.id_mahasiswa,
                    id_lrk: body.id_lrk,
                    metode: body.metode,
                    pelaksanaan: body.pelaksanaan,
                    capaian: body.capaian,
                    hambatan: body.hambatan,
                    kelanjutan: body.kelanjutan,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addLpk module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _lpk();
