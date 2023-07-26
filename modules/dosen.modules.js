const { prisma, Prisma, Role } = require("../helpers/database");
const { uploadDrive } = require("../helpers/upload");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _dosen {
  listDosen = async () => {
    try {
      const list = await prisma.dosen.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listDosenWilayah = async (id_kecamatan) => {
    try {
      const list = await prisma.proposal.findMany({
        where: {
          id_kecamatan,
          status: 1,
        },
        select: {
          dosen: {
            select: {
              nama: true,
            },
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listDosenWilayah module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getDosen = async (id_dosen) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_dosen);

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

      const dosen = await prisma.dosen.findUnique({
        where: {
          id_dosen,
        },
        select: {
          id_dosen: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: dosen,
      };
    } catch (error) {
      console.error("getDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importDosen = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["dosen"],
        columnToKey: {
          B: "nama",
          C: "nip",
        },
      });

      for (let i = 0; i < result.dosen.length; i++) {
        const e = result.dosen[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nip),
          },
          select: {
            username: true,
          },
        });

        const checkDosen = await prisma.dosen.findUnique({
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
        } else if (checkDosen) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkDosen.nip,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nip),
            password: bcrypt.hashSync(String(e.nip), 10),
            role: Role.DOSEN,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.dosen.create({
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
      console.error("importDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addDosen = async (body) => {
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
          role: Role.DOSEN,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.dosen.create({
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

      console.error("addDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editDosen = async (id_dosen, body) => {
    try {
      body = {
        id_dosen,
        ...body,
      };

      const schema = Joi.object({
        id_dosen: Joi.number().required(),
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

      const dosen = await prisma.dosen.findUnique({
        where: {
          id_dosen: body.id_dosen,
        },
      });

      if (!dosen) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (dosen.nip != body.nip) {
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
          username: dosen.nip,
        },
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
        },
      });

      await prisma.dosen.update({
        where: {
          id_dosen: body.id_dosen,
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

      console.error("editDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteDosen = async (id_dosen) => {
    try {
      const checkDosenRegistered = await prisma.proposal.findFirst({
        where: {
          id_dosen,
          status: 1,
        },
      });

      if (checkDosenRegistered) {
        return {
          status: false,
          code: 403,
          error: "Dosen masih terdaftar di tema KKN",
        };
      }

      const dosen = await prisma.dosen.delete({
        where: {
          id_dosen,
        },
        select: {
          id_user: true,
          proposal: {
            select: {
              id_dokumen: true,
            },
          },
        },
      });

      dosen.proposal.forEach(async (proposal) => {
        await prisma.dokumen.delete({
          where: {
            id_dokumen: proposal.id_dokumen,
          },
        });
      });

      await prisma.user.delete({
        where: {
          id_user: dosen.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addTemaTematik = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        periode: Joi.string().required(),
        jenis: Joi.number().required(),
        kab: Joi.string().required(),
        kec: Joi.string().required(),
        desa: Joi.string().required(),
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

      const add = await prisma.tema.create({
        data: {
          nama: body.nama,
          periode: body.periode,
          jenis: body.jenis,
          kab: body.kab,
          kec: body.kec,
          desa: body.desa,
        },
        select: {
          id_tema: true,
        },
      });

      const list = await prisma.halaman.findMany();

      for (let i = 0; i < list.length; i++) {
        await prisma.tema_halaman.create({
          data: {
            id_tema: add.id_tema,
            id_halaman: list[i].id_halaman,
          },
        });
      }

      const temaHalaman = await prisma.tema_halaman.findFirst({
        where: {
          id_tema: add.id_tema,
          id_halaman: list[0].id_halaman,
        },
      });

      const gelombang = await prisma.gelombang.create({
        data: {
          id_tema_halaman: temaHalaman.id_tema_halaman,
          nama: "Gelombang 1 Dosen",
          tgl_mulai: null,
          tgl_akhir: null,
        },
        select: {
          id_gelombang: true,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editTemaTematik = async (id_tema, body) => {
    try {
      body = {
        id_tema,
        ...body,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        nama: Joi.string().required(),
        periode: Joi.string().required(),
        jenis: Joi.number().required(),
        kab: Joi.string().required(),
        kec: Joi.string().required(),
        desa: Joi.string().required(),
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

      const check = await prisma.tema.findUnique({
        where: {
          id_tema,
        },
        select: {
          status: true,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      await prisma.tema.update({
        where: {
          id_tema,
        },
        data: {
          nama: body.nama,
          periode: body.periode,
          kab: body.kab,
          kec: body.kec,
          desa: body.desa,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _dosen();
