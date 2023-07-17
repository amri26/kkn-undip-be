const { prisma, Role } = require("../helpers/database");
const Joi = require("joi");

class _pengumuman {
  listAllPengumuman = async () => {
    try {
      const list = await prisma.pengumuman.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaPengumuman = async () => {
    try {
      const list = await prisma.pengumuman.findMany({
        where: {
          peruntukan: {
            contains: Role.MAHASISWA,
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listDosenPengumuman = async () => {
    try {
      const list = await prisma.pengumuman.findMany({
        where: {
          peruntukan: {
            contains: Role.DOSEN,
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listDosenPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listBappedaPengumuman = async () => {
    try {
      const list = await prisma.pengumuman.findMany({
        where: {
          peruntukan: {
            contains: Role.BAPPEDA,
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listBappedaPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getPengumuman = async (id_pengumuman) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_pengumuman);

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

      const pengumuman = await prisma.pengumuman.findUnique({
        where: {
          id_pengumuman,
        },
      });

      return {
        status: true,
        data: pengumuman,
      };
    } catch (error) {
      console.error("getPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _pengumuman();
