const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _nilai {
  listNilaiKecamatan = async (id_kecamatan) => {
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

      const list = await prisma.nilai.findMany({
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
        data: list,
      };
    } catch (error) {
      console.error("listNilaiKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getNilai = async (id_nilai) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_nilai);

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

      const nilai = await prisma.nilai.findUnique({
        where: {
          id_nilai,
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
        data: nilai,
      };
    } catch (error) {
      console.error("getNilai module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  resetNlai = async (id_nilai) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_nilai);

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

      await prisma.nilai.update({
        where: {
          id_nilai,
        },
        data: {
          pembekalan: null,
          upacara: null,
          kehadiran_dilokasi: null,
          lrk: null,
          integritas: null,
          sosial_kemasyarakatan: null,
          lpk: null,
          ujian_akhir: null,
          tugas: null,
          uts: null,
          uas: null,
          nilai_akhir: null,
          nilai_huruf: null,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("resetNlai module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _nilai();
