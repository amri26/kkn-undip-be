const { prisma } = require("../helpers/database");
const Joi = require("joi");
const { checkDate } = require("../helpers/utils");

class _halaman {
  listHalaman = async (id_tema) => {
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

      const list = await prisma.tema_halaman.findMany({
        where: {
          id_tema,
        },
        include: {
          halaman: true,
          tema: true,
        },
      });

      // check tanggal mulai dan akhir
      list.forEach(async (item) => {
        if (item.tgl_mulai && item.tgl_akhir) {
          let isOpen = checkDate(item.tgl_mulai, item.tgl_akhir);

          if (!(isOpen && item.isStatusEdited)) {
            item.status = isOpen;

            await prisma.tema_halaman.update({
              where: {
                id_tema_halaman: item.id_tema_halaman,
              },
              data: {
                status: item.status,
              },
            });
          }
        }
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getHalaman = async (id_tema_halaman) => {
    try {
      const body = {
        id_tema_halaman,
      };

      const schema = Joi.object({
        id_tema_halaman: Joi.number().required(),
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

      const halaman = await prisma.tema_halaman.findUnique({
        where: {
          id_tema_halaman,
        },
        include: {
          halaman: {
            select: {
              nama: true,
            },
          },
          tema: {
            select: {
              nama: true,
            },
          },
        },
      });

      halaman.nama = halaman.halaman?.nama;
      halaman.nama_tema = halaman.tema?.nama;

      delete halaman.halaman;
      delete halaman.tema;

      return {
        status: true,
        data: halaman,
      };
    } catch (error) {
      console.error("getHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addHalaman = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
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

      await prisma.halaman.create({
        data: {
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editHalaman = async (id_tema_halaman, body) => {
    try {
      body = {
        id_tema_halaman,
        ...body,
      };

      const schema = Joi.object({
        id_tema_halaman: Joi.number().required(),
        tgl_mulai: Joi.date().allow(null),
        tgl_akhir: Joi.date().allow(null),
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

      let isStatusEdited = 0;

      // cek apakah status diubah manual
      if (
        body.tgl_mulai &&
        body.tgl_akhir &&
        checkDate(body.tgl_mulai, body.tgl_akhir) &&
        body.status == 0
      ) {
        isStatusEdited = 1;
      }

      await prisma.tema_halaman.update({
        where: {
          id_tema_halaman: body.id_tema_halaman,
        },
        data: {
          tgl_mulai: body.tgl_mulai ?? null,
          tgl_akhir: body.tgl_akhir ?? null,
          status: body.status ? true : false,
          isStatusEdited: isStatusEdited ? true : false,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  switchHalaman = async (id_tema_halaman) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema_halaman);

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

      const check = await prisma.tema_halaman.findUnique({
        where: {
          id_tema_halaman,
        },
        select: {
          tgl_akhir: true,
          tgl_mulai: true,
          status: true,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (
        check.tgl_mulai &&
        check.tgl_akhir &&
        !checkDate(check.tgl_mulai, check.tgl_akhir) &&
        check.status == false
      ) {
        return {
          status: false,
          code: 403,
          error: "Halaman sudah berakhir!",
        };
      }

      let isStatusEdited = 0;

      // cek apakah status diubah manual
      if (
        check.tgl_mulai &&
        check.tgl_akhir &&
        checkDate(check.tgl_mulai, check.tgl_akhir) &&
        check.status == true
      ) {
        isStatusEdited = 1;
      }

      await prisma.tema_halaman.update({
        where: {
          id_tema_halaman,
        },
        data: {
          status: !check.status,
          isStatusEdited: isStatusEdited ? true : false,
        },
      });

      // await prisma.tema_halaman.update({
      //   where: {
      //     id_tema_halaman,
      //   },
      //   data: {
      //     status: !check.status,
      //   },
      // });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("switchHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  checkHalaman = async (id_tema, id_halaman) => {
    try {
      const body = {
        id_tema,
        id_halaman,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_halaman: Joi.number().required(),
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

      const halaman = await prisma.tema_halaman.findFirst({
        where: {
          id_tema,
          id_halaman,
        },
        select: {
          id_tema_halaman: true,
          status: true,
          isStatusEdited: true,
        },
      });

      // check tanggal mulai dan akhir
      if (halaman.tgl_mulai && halaman.tgl_akhir) {
        let isOpen = checkDate(halaman.tgl_mulai, halaman.tgl_akhir);

        if (!(isOpen && halaman.isStatusEdited)) {
          halaman.status = isOpen;

          await prisma.tema_halaman.update({
            where: {
              id_tema_halaman: halaman.id_tema_halaman,
            },
            data: {
              status: halaman.status,
            },
          });
        }
      }

      return {
        status: true,
        data: halaman.status,
      };
    } catch (error) {
      console.error("checkHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _halaman();
