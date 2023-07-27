const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
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

  addAdmin = async (body) => {
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
          role: Role.ADMIN,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.admin.create({
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

      console.error("addAdmin module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editAdmin = async (id_admin, body) => {
    try {
      body = {
        id_admin,
        ...body,
      };

      const schema = Joi.object({
        id_admin: Joi.number().required(),
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

      const admin = await prisma.admin.findUnique({
        where: {
          id_admin: body.id_admin,
        },
      });

      if (!admin) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (admin.nip != body.nip) {
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
          username: admin.nip,
        },
        data: {
          username: body.nip,
        },
      });

      await prisma.admin.update({
        where: {
          id_admin: body.id_admin,
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

      console.error("editAdmin module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _admin();
