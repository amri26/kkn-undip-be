const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _fakultas {
    listFakultas = async () => {
        try {
            const list = await prisma.fakultas.findMany({
                include: {
                    prodi: true,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listFakultas module error", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _fakultas();
