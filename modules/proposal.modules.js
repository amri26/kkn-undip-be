const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _proposal {
    listProposal = async (body) => {
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
            console.error("listProposal module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _proposal();
