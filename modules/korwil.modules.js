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

  getKorwil = async (id_korwil) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_korwil);

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

      const korwil = await prisma.korwil.findUnique({
        where: {
          id_korwil,
        },
        select: {
          id_korwil: true,
          nama: true,
          nk: true,
        },
      });

      return {
        status: true,
        data: korwil,
      };
    } catch (error) {
      console.error("getKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _korwil();
