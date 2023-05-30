const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _laporan {
    listLaporan = async () => {
        try {
            const list = await prisma.laporan.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listLaporan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _laporan();
