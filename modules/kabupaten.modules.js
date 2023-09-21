const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _kabupaten {
  listKabupatenTema = async (id_tema) => {
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
              _count: {
                select: {
                  mahasiswa_kecamatan: true,
                },
              },
              desa: true,
            },
          },
        },
      });

      list.forEach((kabupaten) => {
        kabupaten.kecamatan.forEach((kecamatan) => {
          kecamatan.jumlah_pendaftar = kecamatan._count.mahasiswa_kecamatan;
          delete kecamatan._count;
        });
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listKabupaten module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listKabupatenBappeda = async (id_user) => {
    try {
      const body = {
        id_user,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const bappeda = await prisma.bappeda.findUnique({
        where: {
          id_user,
        },
      });

      if (!bappeda) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const list = await prisma.kabupaten.findMany({
        where: {
          id_bappeda: bappeda.id_bappeda,
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
      console.error("listKabupatenBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listKabupatenBappedaTema = async (id_tema, id_bappeda) => {
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
      console.error("listKabupatenBappedaTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addKabupaten = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
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

      const checkBappeda = await prisma.bappeda.findUnique({
        where: {
          id_user,
        },
        select: {
          id_bappeda: true,
          nama_kabupaten: true,
        },
      });

      if (!checkBappeda) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkTema = await prisma.tema.findUnique({
        where: {
          id_tema: body.id_tema,
        },
        select: {
          status: true,
        },
      });

      if (!checkTema.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Tema data is not activated",
        };
      }

      const checkKabupaten = await prisma.kabupaten.findFirst({
        where: {
          id_bappeda: checkBappeda.id_bappeda,
          id_tema: body.id_tema,
        },
        select: {
          id_kabupaten: true,
        },
      });

      if (checkKabupaten) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kabupaten data is already created",
        };
      }

      await prisma.kabupaten.create({
        data: {
          id_bappeda: checkBappeda.id_bappeda,
          id_tema: body.id_tema,
          nama: checkBappeda.nama_kabupaten,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKabupaten module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _kabupaten();
