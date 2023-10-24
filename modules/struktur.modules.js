const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _struktur {
  async getStruktur() {
    try {
      const struktur = await prisma.p2kkn_struktur.findFirst({
        include: {
          pimpinan_kepala: true,
          pimpinan_sekretaris: true,
          koordinator: {
            include: {
              pimpinan: true,
            },
          },
        },
      });

      if (!struktur) {
        return {
          status: false,
          code: 404,
          data: "Struktur not found!",
        };
      }
      return {
        status: true,
        data: struktur,
      };
    } catch (error) {
      console.error("getStruktur module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editStruktur(body) {
    try {
      const schema = Joi.object({
        id_kepala: Joi.number().required().strict(),
        id_sekretaris: Joi.number().required().strict(),
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

      const struktur = await prisma.p2kkn_struktur.findFirst();

      if (!struktur) {
        return {
          status: false,
          code: 404,
          data: "Struktur not found!",
        };
      }

      await prisma.p2kkn_struktur.update({
        where: {
          id_struktur: struktur.id_struktur,
        },
        data: {
          kepala:
            body.id_kepala != 0
              ? body.id_kepala ?? body.id_kepala
              : struktur.kepala,
          sekretaris:
            body.id_sekretaris != 0
              ? body.id_sekretaris ?? body.id_sekretaris
              : struktur.sekretaris,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editStruktur module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _struktur();
