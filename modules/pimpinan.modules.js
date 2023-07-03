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
}

module.exports = new _pimpinan();
