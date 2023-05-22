const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _gelombang {
    listGelombang = async (id_halaman) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_halaman);

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

            const list = await prisma.gelombang.findMany({
                where: {
                    id_halaman,
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
}

module.exports = new _gelombang();
