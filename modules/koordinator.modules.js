const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _koordinator {
  async listKoordinator() {
    try {
      const koordinator = await prisma.p2kkn_koordinator.findMany({
        include: {
          struktur: true,
          pimpinan: true,
        },
      });

      return {
        status: true,
        data: koordinator,
      };
    } catch (error) {
      console.error("listKoordinator module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async getKoordinator(id_koordinator) {
    try {
      const koordinator = await prisma.p2kkn_koordinator.findFirst({
        where: {
          id_koordinator,
        },
        include: {
          struktur: true,
          pimpinan: true,
        },
      });

      if (!koordinator) {
        return {
          status: false,
          code: 404,
          data: "Koordinator not found!",
        };
      }

      return {
        status: true,
        data: koordinator,
      };
    } catch (error) {
      console.error("getKoordinator module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async addKoordinator(body) {
    try {
      const schema = Joi.object({
        id_pimpinan: Joi.number().required().strict(),
        id_struktur: Joi.number().required().strict(),
      });

      const { error } = schema.validate(body);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          code: 403,
          data: errorDetails.join(", "),
        };
      }

      await prisma.p2kkn_koordinator.create({
        data: {
          id_pimpinan: body.id_pimpinan,
          id_struktur: body.id_struktur,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKoordinator module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editKoordinator(id_koordinator, body) {
    try {
      const schema = Joi.object({
        id_pimpinan: Joi.number().required().strict(),
        id_struktur: Joi.number().required().strict(),
      });

      const { error } = schema.validate(body);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          code: 403,
          data: errorDetails.join(", "),
        };
      }

      await prisma.p2kkn_koordinator.update({
        where: {
          id_koordinator,
        },
        data: {
          id_pimpinan: body.id_pimpinan,
          id_struktur: body.id_struktur,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editKoordinator module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async deleteKoordinator(id_koordinator) {
    try {
      await prisma.p2kkn_koordinator.delete({
        where: {
          id_koordinator,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteKoordinator module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _koordinator();
