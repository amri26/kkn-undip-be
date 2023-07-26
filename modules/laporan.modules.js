const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _laporan {
  listLaporan = async () => {
    try {
      const list = await prisma.laporan.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listLaporanType = async (id_user, type) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_user);

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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      if (!checkMahasiswa) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      let list = [];
      if (type === "lrk") {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
          select: {
            id_laporan: true,
            id_mahasiswa: true,
            kategori: true,
            potensi: true,
            program: true,
            sasaran: true,
            metode: true,
            luaran: true,
            komentar: true,
            created_at: true,
          },
        });
      } else {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });
      }

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listLaporanType module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listLaporanKecamatan = async (id_kecamatan) => {
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

      const listLaporan = await prisma.laporan.findMany({
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
        data: listLaporan,
      };
    } catch (error) {
      console.error("listLaporanKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getLaporan = async (id_laporan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_laporan);

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

      const laporan = await prisma.laporan.findUnique({
        where: {
          id_laporan,
        },
      });

      return {
        status: true,
        data: laporan,
      };
    } catch (error) {
      console.error("getLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        kategori: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          kategori: body.kategori,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("editLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLPK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        pelaksanaan: Joi.string().required(),
        capaian: Joi.string().required(),
        hambatan: Joi.string().required(),
        kelanjutan: Joi.string().required(),
        metode: Joi.string().required(),
        dokumentasi: Joi.string().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      const checkLaporan = await prisma.laporan.findUnique({
        where: {
          id_laporan: body.id_laporan,
        },
      });

      if (!checkMahasiswaKecamatan || !checkLaporan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          pelaksanaan: body.pelaksanaan,
          capaian: body.capaian,
          hambatan: body.hambatan,
          kelanjutan: body.kelanjutan,
          metode: body.metode,
          dokumentasi: body.dokumentasi,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLPK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteLaporan = async (id_laporan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_laporan);

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

      const laporan = await prisma.laporan.findUnique({
        where: {
          id_laporan,
        },
      });

      if (!laporan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      await prisma.laporan.delete({
        where: {
          id_laporan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  evaluateLaporan = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_laporan: Joi.number().required(),
        komentar: Joi.string(),
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

      const checkLaporan = await prisma.laporan.findUnique({
        where: {
          id_laporan: body.id_laporan,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      if (!checkDosen || !checkLaporan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkLaporan.id_mahasiswa,
          },
          select: {
            id_kecamatan: true,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
        select: {
          proposal: {
            where: {
              status: 1,
            },
            select: {
              id_dosen: true,
            },
          },
        },
      });

      if (!checkKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (
        !checkKecamatan.proposal.some((i) => i.id_dosen === checkDosen.id_dosen)
      ) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          komentar: body.komentar,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("evaluateLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _laporan();
