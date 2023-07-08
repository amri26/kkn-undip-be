const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _pimpinan {
  listPimpinan = async () => {
    try {
      const list = await prisma.pimpinan.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getPimpinan = async (id_pimpinan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_pimpinan);

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

      const pimpinan = await prisma.pimpinan.findUnique({
        where: {
          id_pimpinan,
        },
        select: {
          id_pimpinan: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: pimpinan,
      };
    } catch (error) {
      console.error("getPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _pimpinan();
