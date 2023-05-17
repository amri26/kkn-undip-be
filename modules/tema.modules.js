const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _tema {
    listTema = async () => {
        try {
            const list = await prisma.tema.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _tema();
