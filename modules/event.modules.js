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
}

module.exports = new _event();
