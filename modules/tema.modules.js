const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _tema {
  listTema = async () => {
    try {
      const list = await prisma.tema.findMany({
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      list.forEach((item) => {
        item.total_kabupaten = item.kabupaten.length;
        item.total_kecamatan = 0;
        item.total_desa = 0;
        item.kabupaten.forEach((kab) => {
          item.total_kecamatan += kab.kecamatan.length;

          kab.kecamatan.forEach((kec) => {
            item.total_desa += kec.desa.length;
          });
        });
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listTemaActive = async () => {
    try {
      const list = await prisma.tema.findMany({
        where: {
          status: true,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      list.forEach((item) => {
        item.total_kabupaten = item.kabupaten.length;
        item.total_kecamatan = 0;
        item.total_desa = 0;
        item.kabupaten.forEach((kab) => {
          item.total_kecamatan += kab.kecamatan.length;

          kab.kecamatan.forEach((kec) => {
            item.total_desa += kec.desa.length;
          });
        });
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTemaActive module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listTemaDosen = async (id_user) => {
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

      const checkDosen = await prisma.dosen.findUnique({
        where: {
          id_user,
        },
        select: {
          id_dosen: true,
        },
      });

      if (!checkDosen) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const proposal = await prisma.proposal.findMany({
        where: {
          id_dosen: checkDosen.id_dosen,
          status: 1,
        },
        select: {
          kecamatan: {
            select: {
              kabupaten: {
                select: {
                  tema: true,
                },
              },
            },
          },
        },
      });

      const id_tema = proposal.map(
        (item) => item.kecamatan.kabupaten.tema.id_tema
      );

      const list = await prisma.tema.findMany({
        where: {
          id_tema: {
            in: id_tema,
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTemaDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getTema = async (id_tema) => {
    try {
      const body = {
        id_tema,
      };

      const schema = Joi.object({
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

      const tema = await prisma.tema.findUnique({
        where: {
          id_tema,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        status: true,
        data: tema,
      };
    } catch (error) {
      console.error("getTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _tema();
