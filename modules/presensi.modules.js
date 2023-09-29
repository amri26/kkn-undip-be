const { prisma } = require("../helpers/database");
const Joi = require("joi");
const moment = require("moment");

class _presensi {
  async listPresensi() {
    try {
      const list = await prisma.presensi.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPresensi module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async listPresensiTema(id_tema) {
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
      console.error("listPresensiTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async addPresensi(id_tema) {
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
}

module.exports = new _presensi();
