const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _proposal {
    listProposal = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.proposal.findMany({
                where: {
                    kecamatan: {
                        kabupaten: {
                            id_tema,
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
