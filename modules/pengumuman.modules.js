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

  addPengumuman = async (body) => {
    try {
      const schema = Joi.object({
        judul: Joi.string().required(),
        isi: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.pengumuman.create({
        data: {
          judul: body.judul,
          isi: body.isi,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editPengumuman = async (id_pengumuman, body) => {
    try {
      body = {
        id_pengumuman,
        ...body,
      };

      const schema = Joi.object({
        id_pengumuman: Joi.number().required(),
        judul: Joi.string().required(),
        isi: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.pengumuman.update({
        where: {
          id_pengumuman: body.id_pengumuman,
        },
        data: {
          judul: body.judul,
          isi: body.isi,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePengumuman = async (id_pengumuman) => {
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

      await prisma.pengumuman.delete({
        where: {
          id_pengumuman,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _pengumuman();
