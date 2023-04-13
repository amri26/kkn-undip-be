const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _wilayah {
    listKabupaten = async () => {
        try {
            const list = await prisma.kabupaten.findMany();

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

    addKecamatan = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_periode: Joi.number().required(),
                nama: Joi.string().required(),
                potensi: Joi.string().required(),
                desa: Joi.array().items(
                    Joi.object({
                        nama: Joi.string().required(),
                    })
                ),
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

            const check = await prisma.bappeda.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_kabupaten: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const add = await prisma.kecamatan.create({
                data: {
                    id_kabupaten: check.id_kabupaten,
                    nama: body.nama,
                },
                select: {
                    id_kecamatan: true,
                },
            });

            body.desa.forEach(async (e) => {
                await prisma.desa.create({
                    data: {
                        id_kecamatan: add.id_kecamatan,
                        nama: e.nama,
                    },
                });
            });

            await prisma.potensi.create({
                data: {
                    id_kecamatan: add.id_kecamatan,
                    id_periode: body.id_periode,
                    potensi: body.potensi,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addKecamatan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _wilayah();
