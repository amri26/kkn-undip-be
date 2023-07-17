const { prisma } = require("../helpers/database");
const Joi = require("joi");
const { checkDate } = require("../helpers/utils");

class _halaman {
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
}

module.exports = new _halaman();
