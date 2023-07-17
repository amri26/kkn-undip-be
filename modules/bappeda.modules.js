const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _bappeda {
  listBappeda = async () => {
    try {
      const list = await prisma.bappeda.findMany({
        include: {
          kabupaten: {
            include: {
              _count: {
                select: {
                  kecamatan: true,
                },
              },
              kecamatan: {
                include: {
                  _count: {
                    select: {
                      desa: true,
                    },
                  },
                  desa: true,
                },
              },
            },
          },
        },
      });

      // let totalDesa = 0;
      // let totalKecamatan = 0;

      list.forEach((bappeda) => {
        let totalKecamatan = 0;
        let totalDesa = 0;
        bappeda.kabupaten.forEach((kab) => {
          totalKecamatan += kab._count.kecamatan;
          kab.kecamatan.forEach((kec) => {
            totalDesa += kec._count.desa;
          });
          bappeda.total_desa = totalDesa;
        });
        if (bappeda.kabupaten.length <= 0) bappeda.total_desa = 0;
        bappeda.total_kecamatan = totalKecamatan;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getBappeda = async (id_bappeda) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_bappeda);

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
          id_bappeda,
        },
        select: {
          id_bappeda: true,
          nama: true,
          nb: true,
          nama_kabupaten: true,
          nama_pj: true,
        },
      });

      return {
        status: true,
        data: bappeda,
      };
    } catch (error) {
      console.error("getBappeda module error ", error);

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

  addKecamatan = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_kabupaten: Joi.number().required(),
        nama: Joi.string().required(),
        potensi: Joi.string().required(),
        desa: Joi.array().items(
          Joi.object({
            nama: Joi.string().required(),
          })
        ),
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

      const check = await prisma.kabupaten.findUnique({
        where: {
          id_kabupaten: body.id_kabupaten,
        },
        select: {
          bappeda: {
            select: {
              id_user: true,
            },
          },
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (check.bappeda.id_user !== id_user) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      const add = await prisma.kecamatan.create({
        data: {
          id_kabupaten: body.id_kabupaten,
          nama: body.nama,
          potensi: body.potensi,
        },
        select: {
          id_kecamatan: true,
        },
      });

      body.desa.forEach(async (e) => {
        await prisma.desa.create({
          data: {
            id_kecamatan: add.id_kecamatan,
            nama: e.nama,
          },
        });
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _bappeda();
