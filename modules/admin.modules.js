const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _admin {
  listAdmin = async () => {
    try {
      const list = await prisma.admin.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listAdmin module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getAdmin = async (id_admin) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_admin);

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

      const admin = await prisma.admin.findUnique({
        where: {
          id_admin,
        },
        select: {
          id_admin: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: admin,
      };
    } catch (error) {
      console.error("getAdmin module error ", error);

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

module.exports = new _admin();
