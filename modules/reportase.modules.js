const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _reportase {
  listReportase = async () => {
    try {
      const list = await prisma.reportase.findMany({
        include: {
          mahasiswa: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportaseKecamatan = async (id_kecamatan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_kecamatan);

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

      const listReportase = await prisma.reportase.findMany({
        where: {
          mahasiswa: {
            mahasiswa_kecamatan_active: {
              id_kecamatan,
            },
          },
        },
        include: {
          mahasiswa: {
            include: {
              prodi: {
                select: {
                  nama: true,
                  fakultas: {
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
        data: listReportase,
      };
    } catch (error) {
      console.error("listReportaseKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getReportase = async (id_reportase) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_reportase);

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

      const reportase = await prisma.reportase.findUnique({
        where: {
          id_reportase,
        },
        include: {
          mahasiswa: true,
        },
      });

      return {
        status: true,
        data: reportase,
      };
    } catch (error) {
      console.error("getReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _reportase();
