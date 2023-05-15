const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _potensi {
    listPotensi = async (id_periode) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_periode);

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
                    id_periode,
                },
                include: {
                    kabupaten: {
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
}

module.exports = new _potensi();
