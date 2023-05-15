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

    listKecamatan = async (body) => {
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

            const list = await prisma.kecamatan.findMany({
                where: {
                    id_periode: body.id_periode,
                    id_kabupaten: body.id_kabupaten,
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
