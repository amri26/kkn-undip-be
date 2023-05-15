const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _reviewer {
    listReviewer = async () => {
        try {
            const list = await prisma.reviewer.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listReviewer module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _reviewer();
