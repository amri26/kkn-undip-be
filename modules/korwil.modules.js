const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _korwil {
    listKorwil = async () => {
        try {
            const list = await prisma.korwil.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listKorwil module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _korwil();
