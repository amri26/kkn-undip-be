const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");
const { checkDate } = require("../helpers/utils");

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

  listUser = async () => {
    try {
      const list = await prisma.user.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listUser module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listTema = async () => {
    try {
      const list = await prisma.tema.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addTema = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        periode: Joi.string().required(),
        jenis: Joi.number().required(),
        kab: Joi.string().allow(null, ""),
        kec: Joi.string().allow(null, ""),
        desa: Joi.string().allow(null, ""),
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

  editTema = async (id_tema, body) => {
    try {
      body = {
        id_tema,
        ...body,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        nama: Joi.string().required(),
        periode: Joi.string().required(),
        kab: Joi.string().allow(null),
        kec: Joi.string().allow(null),
        desa: Joi.string().allow(null),
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

  switchTema = async (id_tema) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema);

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
          status: !check.status,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("switchTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listHalaman = async (id_tema) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema);

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

      const list = await prisma.tema_halaman.findMany({
        where: {
          id_tema,
        },
        include: {
          halaman: true,
          tema: true,
        },
      });

      // check tanggal mulai dan akhir
      list.forEach(async (item) => {
        if (item.tgl_mulai && item.tgl_akhir) {
          let isOpen = checkDate(item.tgl_mulai, item.tgl_akhir);

          if (!(isOpen && item.isStatusEdited)) {
            item.status = isOpen;

            await prisma.tema_halaman.update({
              where: {
                id_tema_halaman: item.id_tema_halaman,
              },
              data: {
                status: item.status,
              },
            });
          }
        }
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addHalaman = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
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

      await prisma.halaman.create({
        data: {
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editHalaman = async (id_tema_halaman, body) => {
    try {
      body = {
        id_tema_halaman,
        ...body,
      };

      const schema = Joi.object({
        id_tema_halaman: Joi.number().required(),
        tgl_mulai: Joi.date().allow(null),
        tgl_akhir: Joi.date().allow(null),
        status: Joi.number().required(),
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

      let isStatusEdited = 0;

      // cek apakah status diubah manual
      if (
        body.tgl_mulai &&
        body.tgl_akhir &&
        checkDate(body.tgl_mulai, body.tgl_akhir) &&
        body.status == 0
      ) {
        isStatusEdited = 1;
      }

      await prisma.tema_halaman.update({
        where: {
          id_tema_halaman: body.id_tema_halaman,
        },
        data: {
          tgl_mulai: body.tgl_mulai ?? null,
          tgl_akhir: body.tgl_akhir ?? null,
          status: body.status ? true : false,
          isStatusEdited: isStatusEdited ? true : false,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  switchHalaman = async (id_tema_halaman) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema_halaman);

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

      const check = await prisma.tema_halaman.findUnique({
        where: {
          id_tema_halaman,
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

      await prisma.tema_halaman.update({
        where: {
          id_tema_halaman,
        },
        data: {
          status: !check.status,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("switchHalaman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listGelombang = async (id_tema) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_tema);

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

      const list = await prisma.gelombang.findMany({
        where: {
          tema_halaman: {
            id_tema,
          },
        },
        include: {
          tema_halaman: {
            select: {
              halaman: {
                select: {
                  nama: true,
                },
              },
              tema: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      });

      // check tanggal mulai dan akhir
      list.forEach(async (item) => {
        if (item.tgl_mulai && item.tgl_akhir) {
          let isOpen = checkDate(item.tgl_mulai, item.tgl_akhir);

          if (!(isOpen && item.isStatusEdited)) {
            item.status = isOpen;

            await prisma.gelombang.update({
              where: {
                id_gelombang: item.id_gelombang,
              },
              data: {
                status: item.status,
              },
            });
          }
        }
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getGelombang = async (id_gelombang) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_gelombang);

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

      const gelombang = await prisma.gelombang.findUnique({
        where: {
          id_gelombang,
        },
      });

      return {
        status: true,
        data: gelombang,
      };
    } catch (error) {
      console.error("getGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addGelombang = async (body) => {
    try {
      const schema = Joi.object({
        id_tema_halaman: Joi.number().required(),
        nama: Joi.string().required(),
        tgl_mulai: Joi.date().allow(null),
        tgl_akhir: Joi.date().allow(null),
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

      await prisma.gelombang.create({
        data: {
          id_tema_halaman: body.id_tema_halaman,
          nama: body.nama,
          tgl_mulai: body.tgl_mulai ?? null,
          tgl_akhir: body.tgl_akhir ?? null,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editGelombang = async (id_gelombang, body) => {
    try {
      body = {
        id_gelombang,
        ...body,
      };

      const schema = Joi.object({
        id_gelombang: Joi.number().required(),
        id_tema_halaman: Joi.number().required(),
        nama: Joi.string().required(),
        tgl_mulai: Joi.date().allow(null),
        tgl_akhir: Joi.date().allow(null),
        status: Joi.number().required(),
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

      let isStatusEdited = 0;

      // cek apakah status diubah manual
      if (
        body.tgl_mulai &&
        body.tgl_akhir &&
        checkDate(body.tgl_mulai, body.tgl_akhir) &&
        body.status == 0
      ) {
        isStatusEdited = 1;
      }

      await prisma.gelombang.update({
        where: {
          id_gelombang,
        },
        data: {
          id_tema_halaman: body.id_tema_halaman,
          nama: body.nama,
          tgl_mulai: body.tgl_mulai ?? null,
          tgl_akhir: body.tgl_akhir ?? null,
          status: body.status ? true : false,
          isStatusEdited: isStatusEdited ? true : false,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  switchGelombang = async (id_gelombang) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_gelombang);

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

      const check = await prisma.gelombang.findUnique({
        where: {
          id_gelombang,
        },
        select: {
          tgl_akhir: true,
          tgl_mulai: true,
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

      if (
        !checkDate(check.tgl_mulai, check.tgl_akhir) &&
        check.status == false
      ) {
        return {
          status: false,
          code: 403,
          error: "Gelombang sudah berakhir!",
        };
      }

      let isStatusEdited = 0;

      // cek apakah status diubah manual
      if (
        check.tgl_mulai &&
        check.tgl_akhir &&
        checkDate(check.tgl_mulai, check.tgl_akhir) &&
        check.status == true
      ) {
        isStatusEdited = 1;
      }

      await prisma.gelombang.update({
        where: {
          id_gelombang,
        },
        data: {
          status: !check.status,
          isStatusEdited: isStatusEdited ? true : false,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("switchGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addMahasiswa = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["mahasiswa"],
        columnToKey: {
          B: "nama",
          C: "nim",
        },
      });

      for (let i = 0; i < result.mahasiswa.length; i++) {
        const e = result.mahasiswa[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nim),
          },
          select: {
            username: true,
          },
        });

        const checkMahasiswa = await prisma.mahasiswa.findUnique({
          where: {
            nim: String(e.nim),
          },
          select: {
            nim: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkUser.username,
          };
        } else if (checkMahasiswa) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkMahasiswa.nim,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nim),
            password: bcrypt.hashSync(String(e.nim), 10),
            role: Role.MAHASISWA,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.mahasiswa.create({
          data: {
            nama: e.nama,
            nim: String(e.nim),
            id_user: addUser.id_user,
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addMahasiswaSingle = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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
          username: body.nim,
          password: bcrypt.hashSync(body.nim, 10),
          role: Role.MAHASISWA,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.mahasiswa.create({
        data: {
          nama: body.nama,
          nim: body.nim,
          id_user: addUser.id_user,
          id_prodi: body.prodi,
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

      console.error("addMahasiswaSingle module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editMahasiswa = async (id_mahasiswa, body) => {
    try {
      body = {
        id_mahasiswa,
        ...body,
      };

      const schema = Joi.object({
        id_mahasiswa: Joi.number().required(),
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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

      const mhs = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
      });

      if (!mhs) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (mhs.nim != body.nim) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nim,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM sudah terdaftar",
          };
        }
      }

      await prisma.user.update({
        where: {
          username: mhs.nim,
        },
        data: {
          username: body.nim,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
        data: {
          nama: body.nama,
          nim: body.nim,
          id_prodi: body.prodi,
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

      console.error("editMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteMahasiswa = async (id_mahasiswa) => {
    try {
      const checkMahasiswaRegistered =
        await prisma.mahasiswa_kecamatan_active.findFirst({
          where: {
            id_mahasiswa,
          },
        });

      if (checkMahasiswaRegistered) {
        return {
          status: false,
          code: 403,
          error: "Mahasiswa masih terdaftar di tema KKN",
        };
      }

      const mahasiswa = await prisma.mahasiswa.delete({
        where: {
          id_mahasiswa,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: mahasiswa.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addDosen = async (file) => {
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
      console.error("addDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addDosenSingle = async (body) => {
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

      console.error("addDosenSingle module error ", error);

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

  addKorwil = async (file) => {
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
      console.error("addKorwil module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addKorwilSingle = async (body) => {
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

      console.error("addKorwilSingle module error ", error);

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

  addBappeda = async (created_by, file) => {
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
      console.error("addBappeda module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addBappedaSingle = async (created_by, body) => {
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

      console.error("addBappedaSingle module error ", error);

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

  addReviewer = async (file) => {
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
      console.error("addReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReviewerSingle = async (body) => {
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

      console.error("addReviewerSingle module error ", error);

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

  addPimpinan = async (file) => {
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
      console.error("addPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addPimpinanSingle = async (body) => {
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

      console.error("addPimpinanSingle module error ", error);

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

  accKecamatan = async (id_kecamatan, body) => {
    try {
      body = {
        id_kecamatan,
        ...body,
      };

      const schema = Joi.object({
        id_kecamatan: Joi.number().required(),
        id_korwil: Joi.number().required(),
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

      await prisma.kecamatan.update({
        where: {
          id_kecamatan,
        },
        data: {
          id_korwil: body.id_korwil,
          status: 1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("accKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decKecamatan = async (id_kecamatan) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_kecamatan);

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

      await prisma.kecamatan.update({
        where: {
          id_kecamatan,
        },
        data: {
          id_korwil: null,
          status: -1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("decKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  accProposal = async (id_proposal) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_proposal);

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

      await prisma.proposal.update({
        where: {
          id_proposal,
        },
        data: {
          status: 1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("accProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decProposal = async (id_proposal) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_proposal);

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

      await prisma.proposal.update({
        where: {
          id_proposal,
        },
        data: {
          status: -1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("decProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _admin();
