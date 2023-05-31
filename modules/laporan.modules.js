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

  getLaporan = async (id_laporan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_laporan);

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

      const laporan = await prisma.laporan.findUnique({
        where: {
          id_laporan,
        },
      });

      return {
        status: true,
        data: laporan,
      };
    } catch (error) {
      console.error("getLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _laporan();
