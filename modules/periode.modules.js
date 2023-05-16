const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _periode {
    listPeriode = async () => {
        try {
            const list = await prisma.periode.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listPeriode module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _periode();
