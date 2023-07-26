const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _bappeda {
  listBappeda = async () => {
    try {
      const list = await prisma.bappeda.findMany({
        include: {
          kabupaten: {
            include: {
              _count: {
                select: {
                  kecamatan: true,
                },
              },
              kecamatan: {
                include: {
                  _count: {
                    select: {
                      desa: true,
                    },
                  },
                  desa: true,
                },
              },
            },
          },
        },
      });

      // let totalDesa = 0;
      // let totalKecamatan = 0;

      list.forEach((bappeda) => {
        let totalKecamatan = 0;
        let totalDesa = 0;
        bappeda.kabupaten.forEach((kab) => {
          totalKecamatan += kab._count.kecamatan;
          kab.kecamatan.forEach((kec) => {
            totalDesa += kec._count.desa;
          });
          bappeda.total_desa = totalDesa;
        });
        if (bappeda.kabupaten.length <= 0) bappeda.total_desa = 0;
        bappeda.total_kecamatan = totalKecamatan;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getBappeda = async (id_bappeda) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_bappeda);

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

      const bappeda = await prisma.bappeda.findUnique({
        where: {
          id_bappeda,
        },
        select: {
          id_bappeda: true,
          nama: true,
          nb: true,
          nama_kabupaten: true,
          nama_pj: true,
        },
      });

      return {
        status: true,
        data: bappeda,
      };
    } catch (error) {
      console.error("getBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importBappeda = async (created_by, file) => {
    try {
      const schema = Joi.string().required();

      const validation = schema.validate(created_by);

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

      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["bappeda"],
        columnToKey: {
          B: "nama",
          C: "nb",
          D: "nama_kabupaten",
          E: "nama_pj",
        },
      });

      for (let i = 0; i < result.bappeda.length; i++) {
        const e = result.bappeda[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nb),
          },
          select: {
            username: true,
          },
        });

        const checkBappeda = await prisma.bappeda.findUnique({
          where: {
            nb: String(e.nb),
          },
          select: {
            nb: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NB " + checkUser.username,
          };
        } else if (checkBappeda) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NB " + checkBappeda.nb,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nb),
            password: bcrypt.hashSync(String(e.nb), 10),
            role: Role.BAPPEDA,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.bappeda.create({
          data: {
            id_user: addUser.id_user,
            nama: e.nama,
            nb: String(e.nb),
            nama_kabupaten: e.nama_kabupaten,
            nama_pj: e.nama_pj,
            created_by,
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("importBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addBappeda = async (created_by, body) => {
    try {
      body = {
        created_by,
        ...body,
      };

      const schema = Joi.object({
        nama: Joi.string().required(),
        nb: Joi.string().required(),
        nama_kabupaten: Joi.string().required(),
        nama_pj: Joi.string().required(),
        created_by: Joi.string().required(),
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
          username: body.nb,
          password: bcrypt.hashSync(body.nb, 10),
          role: Role.BAPPEDA,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.bappeda.create({
        data: {
          id_user: addUser.id_user,
          nama: body.nama,
          nb: body.nb,
          nama_kabupaten: body.nama_kabupaten,
          nama_pj: body.nama_pj,
          created_by,
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

      console.error("addBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editBappeda = async (id_bappeda, body) => {
    try {
      body = {
        id_bappeda,
        ...body,
      };

      const schema = Joi.object({
        id_bappeda: Joi.number().required(),
        nama: Joi.string().required(),
        nb: Joi.string().required(),
        nama_kabupaten: Joi.string().required(),
        nama_pj: Joi.string().required(),
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

      const bappeda = await prisma.bappeda.findUnique({
        where: {
          id_bappeda: body.id_bappeda,
        },
      });

      if (!bappeda) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (bappeda.nb != body.nb) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nb,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, nomor induk sudah terdaftar",
          };
        }
      }

      await prisma.user.update({
        where: {
          username: bappeda.nb,
        },
        data: {
          username: body.nb,
          password: bcrypt.hashSync(body.nb, 10),
        },
      });

      await prisma.bappeda.update({
        where: {
          id_bappeda: body.id_bappeda,
        },
        data: {
          nama: body.nama,
          nb: body.nb,
          nama_kabupaten: body.nama_kabupaten,
          nama_pj: body.nama_pj,
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

      console.error("editBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteBappeda = async (id_bappeda) => {
    try {
      const checkBappedaRegistered = await prisma.kecamatan.findFirst({
        where: {
          kabupaten: {
            id_bappeda,
          },
          status: 1,
        },
      });

      if (checkBappedaRegistered) {
        return {
          status: false,
          code: 403,
          error: "Bappeda masih mempunyai lokasi yang terdaftar",
        };
      }

      const bappeda = await prisma.bappeda.delete({
        where: {
          id_bappeda,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: bappeda.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _bappeda();
