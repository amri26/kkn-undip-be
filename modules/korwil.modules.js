const { prisma, Prisma } = require("../helpers/database");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _korwil {
  listKorwil = async () => {
    try {
      const list = await prisma.korwil.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getKorwil = async (id_korwil) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_korwil);

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

      const korwil = await prisma.korwil.findUnique({
        where: {
          id_korwil,
        },
        select: {
          id_korwil: true,
          nama: true,
          nk: true,
        },
      });

      return {
        status: true,
        data: korwil,
      };
    } catch (error) {
      console.error("getKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importKorwil = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["korwil"],
        columnToKey: {
          B: "nama",
          C: "nk",
        },
      });

      for (let i = 0; i < result.korwil.length; i++) {
        const e = result.korwil[i];

        const checkKorwil = await prisma.korwil.findUnique({
          where: {
            nk: String(e.nk),
          },
          select: {
            nk: true,
          },
        });

        if (checkKorwil) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NK " + checkKorwil.nk,
          };
        }

        await prisma.korwil.create({
          data: {
            nama: e.nama,
            nk: String(e.nk),
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("importKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addKorwil = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        nk: Joi.string().required(),
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

      await prisma.korwil.create({
        data: {
          nama: body.nama,
          nk: body.nk,
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

      console.error("addKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editKorwil = async (id_korwil, body) => {
    try {
      body = {
        id_korwil,
        ...body,
      };

      const schema = Joi.object({
        id_korwil: Joi.number().required(),
        nama: Joi.string().required(),
        nk: Joi.string().required(),
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

      const korwil = await prisma.korwil.findUnique({
        where: {
          id_korwil: body.id_korwil,
        },
      });

      if (!korwil) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (korwil.nk != body.nk) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nk,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, nomor induk korwil sudah terdaftar",
          };
        }
      }

      await prisma.korwil.update({
        where: {
          id_korwil: body.id_korwil,
        },
        data: {
          nama: body.nama,
          nk: body.nk,
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

      console.error("editKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteKorwil = async (id_korwil) => {
    try {
      await prisma.korwil.delete({
        where: {
          id_korwil,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _korwil();
