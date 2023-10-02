const { prisma } = require("../helpers/database");
const Joi = require("joi");
const moment = require("moment");

class _presensi {
  async listJadwalPresensi() {
    try {
      const list = await prisma.presensi.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listJadwalPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async listJadwalPresensiTema(id_tema) {
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

      const list = await prisma.presensi.findMany({
        where: {
          id_tema,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listJadwalPresensiTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async listPresensiMahasiswa(id_user) {
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

      const list = await prisma.riwayat_presensi.findMany({
        where: {
          mahasiswa: {
            id_user,
          },
        },
        include: {
          presensi: true,
        },
        orderBy: {
          presensi: {
            tgl: "desc",
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPresensiMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async listPresensiKecamatan(id_kecamatan) {
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

      const list = await prisma.riwayat_presensi.findMany({
        where: {
          mahasiswa: {
            mahasiswa_kecamatan_active: {
              id_kecamatan,
            },
          },
        },
        include: {
          presensi: true,
          mahasiswa: true,
        },
        orderBy: {
          presensi: {
            tgl: "desc",
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPresensiKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async getPresensi(id_mahasiswa, tgl) {
    try {
      const schema = Joi.object({
        id_mahasiswa: Joi.number().required(),
        tgl: Joi.string().required(),
      });

      const validation = schema.validate({ id_mahasiswa, tgl });

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

      tgl = new Date(moment(tgl).format("YYYY-MM-DD"));

      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa,
        },
        include: {
          mahasiswa_kecamatan_active: {
            select: {
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      id_tema: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const presensi = await prisma.presensi.findFirst({
        where: {
          id_tema:
            mahasiswa.mahasiswa_kecamatan_active.kecamatan.kabupaten.id_tema,
          tgl,
        },
      });

      const riwayat = await prisma.riwayat_presensi.findFirst({
        where: {
          id_mahasiswa,
          id_presensi: presensi.id_presensi,
        },
      });

      return {
        status: true,
        data: riwayat,
      };
    } catch (error) {
      console.error("getRiwayatPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async addJadwalPresensi(body) {
    try {
      const schema = Joi.object({
        id_tema: Joi.number().required(),
        tgl: Joi.date().required(),
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
          id_tema: body.id_tema,
        },
      });

      const presensis = await prisma.presensi.findMany({
        where: {
          id_tema: body.id_tema,
        },
      });

      moment.locale("id");

      const temaDuration =
        moment(tema.tgl_akhir).diff(moment(tema.tgl_mulai), "days") + 1;

      if (presensis.length >= temaDuration) {
        return {
          status: false,
          code: 403,
          error: "Jadwal presensi sudah penuh",
        };
      }

      const today = moment();
      const tglSubmitted = moment(body.tgl);

      const check = await prisma.presensi.findFirst({
        where: {
          id_tema: body.id_tema,
          tgl: new Date(tglSubmitted.format("YYYY-MM-DD")),
        },
      });

      if (check) {
        return {
          status: false,
          code: 403,
          error: "Jadwal presensi sudah ada",
        };
      }

      let status = 0;

      if (tglSubmitted.isBefore(today)) {
        status = -1;
      } else if (tglSubmitted.isSame(today)) {
        status = 1;
      }

      await prisma.presensi.create({
        data: {
          id_tema: body.id_tema,
          tgl: body.tgl,
          status,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addJadwalPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async setupJadwalPresensiTema(id_tema) {
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

      const tema = await prisma.tema.findUnique({
        where: {
          id_tema,
        },
      });

      if (!tema) {
        return {
          status: false,
          code: 404,
          error: "Data tema not found",
        };
      }

      moment.locale("id");

      const startDate = moment(tema.tgl_mulai);
      const endDate = moment(tema.tgl_akhir);

      const duration = endDate.diff(startDate, "days");

      const tgl = startDate;
      for (let i = 0; i <= duration; i++) {
        const check = await prisma.presensi.findFirst({
          where: {
            id_tema,
            tgl: new Date(tgl.format("YYYY-MM-DD")),
          },
        });

        if (!check) {
          await prisma.presensi.create({
            data: {
              id_tema,
              tgl: tgl.toDate(),
              status: 0,
            },
          });
        }

        tgl.add(1, "days");
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editPresensi(id_riwayat_presensi, body) {
    try {
      const schema = Joi.object({
        status: Joi.number().required(),
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

      const check = await prisma.riwayat_presensi.findUnique({
        where: {
          id_riwayat_presensi,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data presensi not found",
        };
      }

      await prisma.riwayat_presensi.update({
        where: {
          id_riwayat_presensi,
        },
        data: {
          status: body.status,
          updated_at: new Date(),
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async submitPresensi(id_user, id_tema, body) {
    try {
      body = {
        id_user,
        id_tema,
        ...body,
      };
      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        tgl: Joi.date().required(),
        status: Joi.number().required(),
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

      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user: Number(id_user),
        },
        include: {
          mahasiswa_kecamatan: {
            where: {
              status: 1,
            },
            select: {
              id_mahasiswa_kecamatan: true,
            },
          },
        },
      });

      const tgl = moment(body.tgl).format("YYYY-MM-DD");

      const presensi = await prisma.presensi.findFirst({
        where: {
          id_tema,
          tgl: new Date(tgl),
        },
      });

      if (!presensi) {
        return {
          status: false,
          code: 404,
          error: "Data presensi not found",
        };
      }

      if (presensi.status == 0) {
        return {
          status: false,
          code: 403,
          error: "Presensi belum dibuka",
        };
      }

      if (presensi.status == -1) {
        return {
          status: false,
          code: 403,
          error: "Presensi sudah ditutup",
        };
      }

      const check = await prisma.riwayat_presensi.findFirst({
        where: {
          id_mahasiswa: mahasiswa.id_mahasiswa,
          id_presensi: presensi.id_presensi,
        },
      });

      if (check) {
        return {
          status: false,
          code: 403,
          error: "Presensi sudah diisi",
        };
      }

      await prisma.riwayat_presensi.create({
        data: {
          id_mahasiswa: mahasiswa.id_mahasiswa,
          id_presensi: presensi.id_presensi,
          status: body.status,
          updated_at: new Date(),
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("submitPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async updateStatusJadwalPresensi() {
    try {
      const todayDate = new Date(moment().format("YYYY-MM-DD"));

      const expireds = await prisma.presensi.findMany({
        where: {
          tgl: {
            lt: todayDate,
          },
        },
      });

      // change status to -1
      for (const expired of expireds) {
        await prisma.presensi.update({
          where: {
            id_presensi: expired.id_presensi,
          },
          data: {
            status: -1,
          },
        });
      }

      const todays = await prisma.presensi.findMany({
        where: {
          tgl: todayDate,
        },
      });

      // change status to 1
      for (const today of todays) {
        await prisma.presensi.update({
          where: {
            id_presensi: today.id_presensi,
          },
          data: {
            status: 1,
          },
        });
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("updateStatusJadwalPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async deletePresensi(id_riwayat_presensi) {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_riwayat_presensi);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        );

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const check = await prisma.riwayat_presensi.findUnique({
        where: {
          id_riwayat_presensi,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data presensi not found",
        };
      }

      await prisma.riwayat_presensi.delete({
        where: {
          id_riwayat_presensi,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _presensi();
