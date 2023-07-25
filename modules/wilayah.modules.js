const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _wilayah {
  listAllWilayah = async () => {
    try {
      const list = await prisma.kecamatan.findMany({
        include: {
          kabupaten: {
            select: {
              nama: true,
              tema: true,
            },
          },
          desa: {
            select: {
              nama: true,
            },
          },
        },
      });

      list.forEach((kecamatan) => {
        kecamatan.nama_kabupaten = kecamatan.kabupaten.nama;
        kecamatan.nama_tema = kecamatan.kabupaten.tema.nama;
        kecamatan.periode = kecamatan.kabupaten.tema.periode;

        delete kecamatan.kabupaten;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listAllWilayah module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listWilayah = async (id_tema) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema);

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

      const list = await prisma.kabupaten.findMany({
        where: {
          id_tema,
        },
        include: {
          kecamatan: {
            include: {
              desa: true,
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listWilayah module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMyWilayah = async (id_tema, id_bappeda) => {
    try {
      const body = {
        id_tema,
        id_bappeda,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_bappeda: Joi.number().required(),
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

      const list = await prisma.kabupaten.findMany({
        where: {
          id_tema: body.id_tema,
          id_bappeda: body.id_bappeda,
        },
        include: {
          kecamatan: {
            include: {
              desa: true,
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMyWilayah module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _wilayah();
