const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _pimpinan {
  listPimpinan = async () => {
    try {
      const list = await prisma.pimpinan.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getPimpinan = async (id_pimpinan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_pimpinan);

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

      const pimpinan = await prisma.pimpinan.findUnique({
        where: {
          id_pimpinan,
        },
        select: {
          id_pimpinan: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: pimpinan,
      };
    } catch (error) {
      console.error("getPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importPimpinan = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["pimpinan"],
        columnToKey: {
          B: "nama",
          C: "nip",
        },
      });

      for (let i = 0; i < result.pimpinan.length; i++) {
        const e = result.pimpinan[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nip),
          },
          select: {
            username: true,
          },
        });

        const checkPimpinan = await prisma.pimpinan.findUnique({
          where: {
            nip: String(e.nip),
          },
          select: {
            nip: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkUser.username,
          };
        } else if (checkPimpinan) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkPimpinan.nip,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nip),
            password: bcrypt.hashSync(String(e.nip), 10),
            role: Role.PIMPINAN,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.pimpinan.create({
          data: {
            id_user: addUser.id_user,
            nama: e.nama,
            nip: String(e.nip),
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("importPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addPimpinan = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        nip: Joi.string().required(),
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

      const addUser = await prisma.user.create({
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
          role: Role.PIMPINAN,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.pimpinan.create({
        data: {
          id_user: addUser.id_user,
          nama: body.nama,
          nip: body.nip,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found",
          };
        }
      }

      console.error("addPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editPimpinan = async (id_pimpinan, body) => {
    try {
      body = {
        id_pimpinan,
        ...body,
      };

      const schema = Joi.object({
        id_pimpinan: Joi.number().required(),
        nama: Joi.string().required(),
        nip: Joi.string().required(),
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

      const pimpinan = await prisma.pimpinan.findUnique({
        where: {
          id_pimpinan: body.id_pimpinan,
        },
      });

      if (!pimpinan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (pimpinan.nip != body.nip) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nip,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP sudah terdaftar",
          };
        }
      }

      await prisma.user.update({
        where: {
          username: pimpinan.nip,
        },
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
        },
      });

      await prisma.pimpinan.update({
        where: {
          id_pimpinan: body.id_pimpinan,
        },
        data: {
          nama: body.nama,
          nip: body.nip,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found",
          };
        }
      }

      console.error("editPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePimpinan = async (id_pimpinan) => {
    try {
      const pimpinan = await prisma.pimpinan.delete({
        where: {
          id_pimpinan,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: pimpinan.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _pimpinan();
