const { prisma, Role } = require("../helpers/database");
const Joi = require("joi");

class _event {
  listAllEvent = async () => {
    try {
      const list = await prisma.event.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaEvent = async () => {
    try {
      const list = await prisma.event.findMany({
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
      console.error("listMahasiswaEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listDosenEvent = async () => {
    try {
      const list = await prisma.event.findMany({
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
      console.error("listDosenEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listBappedaEvent = async () => {
    try {
      const list = await prisma.event.findMany({
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
      console.error("listBappedaEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getEvent = async (id_event) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_event);

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

      const event = await prisma.event.findUnique({
        where: {
          id_event,
        },
      });

      return {
        status: true,
        data: event,
      };
    } catch (error) {
      console.error("getEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addEvent = async (body) => {
    try {
      const schema = Joi.object({
        judul: Joi.string().required(),
        keterangan: Joi.string().allow(null, ""),
        tgl_mulai: Joi.date().required(),
        tgl_akhir: Joi.date().required(),
        tempat: Joi.string().required(),
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

      await prisma.event.create({
        data: {
          judul: body.judul,
          keterangan: body.keterangan,
          tgl_mulai: body.tgl_mulai,
          tgl_akhir: body.tgl_akhir,
          tempat: body.tempat,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editEvent = async (id_event, body) => {
    try {
      body = {
        id_event,
        ...body,
      };

      const schema = Joi.object({
        id_event: Joi.number().required(),
        judul: Joi.string().required(),
        keterangan: Joi.string(),
        tgl_mulai: Joi.date().required(),
        tgl_akhir: Joi.date().required(),
        tempat: Joi.string().required(),
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

      await prisma.event.update({
        where: {
          id_event: body.id_event,
        },
        data: {
          judul: body.judul,
          keterangan: body.keterangan,
          tgl_mulai: body.tgl_mulai,
          tgl_akhir: body.tgl_akhir,
          tempat: body.tempat,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteEvent = async (id_event) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_event);

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

      await prisma.event.delete({
        where: {
          id_event,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _event();
