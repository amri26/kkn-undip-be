const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _halaman {
  checkHalaman = async (id_tema, id_halaman) => {
    try {
      const body = {
        id_tema,
        id_halaman,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_halaman: Joi.number().required(),
      });

      const validation = schema.validate(body);

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

      const statusHalaman = await prisma.tema_halaman.findFirst({
        where: {
          id_tema,
          id_halaman,
        },
        select: {
          status: true,
        },
      });

      return {
        status: true,
        data: statusHalaman,
      };
    } catch (error) {
      console.error("checkHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _halaman();
