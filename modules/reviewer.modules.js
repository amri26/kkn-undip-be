const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _reviewer {
  listReviewer = async () => {
    try {
      const list = await prisma.reviewer.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getReviewer = async (id_reviewer) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_reviewer);

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

      const reviewer = await prisma.reviewer.findUnique({
        where: {
          id_reviewer,
        },
        select: {
          id_reviewer: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: reviewer,
      };
    } catch (error) {
      console.error("getReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importReviewer = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["reviewer"],
        columnToKey: {
          B: "nama",
          C: "nip",
        },
      });

      for (let i = 0; i < result.reviewer.length; i++) {
        const e = result.reviewer[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nip),
          },
          select: {
            username: true,
          },
        });

        const checkReviewer = await prisma.reviewer.findUnique({
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
        } else if (checkReviewer) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkReviewer.nip,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nip),
            password: bcrypt.hashSync(String(e.nip), 10),
            role: Role.REVIEWER,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.reviewer.create({
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
      console.error("importReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReviewer = async (body) => {
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
          role: Role.REVIEWER,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.reviewer.create({
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

      console.error("addReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editReviewer = async (id_reviewer, body) => {
    try {
      body = {
        id_reviewer,
        ...body,
      };

      const schema = Joi.object({
        id_reviewer: Joi.number().required(),
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

      const reviewer = await prisma.reviewer.findUnique({
        where: {
          id_reviewer: body.id_reviewer,
        },
      });

      if (!reviewer) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (reviewer.nip != body.nip) {
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
          username: reviewer.nip,
        },
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
        },
      });

      await prisma.reviewer.update({
        where: {
          id_reviewer: body.id_reviewer,
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

      console.error("editReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteReviewer = async (id_reviewer) => {
    try {
      const reviewer = await prisma.reviewer.delete({
        where: {
          id_reviewer,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: reviewer.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _reviewer();
