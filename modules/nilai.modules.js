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

  editNilai = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_nilai: Joi.number().required(),
        pembekalan: Joi.number(),
        upacara: Joi.number(),
        kehadiran_dilokasi: Joi.number(),
        lrk: Joi.number(),
        integritas: Joi.number(),
        sosial_kemasyarakatan: Joi.number(),
        lpk: Joi.number(),
        ujian_akhir: Joi.number(),
        tugas: Joi.number(),
        uts: Joi.number(),
        uas: Joi.number(),
        nilai_akhir: Joi.number(),
        nilai_huruf: Joi.string(),
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

      await prisma.nilai.update({
        where: {
          id_nilai: body.id_nilai,
        },
        data: {
          pembekalan: body.pembekalan,
          upacara: body.upacara,
          kehadiran_dilokasi: body.kehadiran_dilokasi,
          lrk: body.lrk,
          integritas: body.integritas,
          sosial_kemasyarakatan: body.sosial_kemasyarakatan,
          lpk: body.lpk,
          ujian_akhir: body.ujian_akhir,
          tugas: body.tugas,
          uts: body.uts,
          uas: body.uas,
          nilai_akhir: body.nilai_akhir,
          nilai_huruf: body.nilai_huruf,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editNilai module error ", error);

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
