const { prisma } = require("../helpers/database");
const Joi = require("joi");
const { checkDate } = require("../helpers/utils");

class _gelombang {
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

  listGelombangHalaman = async (id_tema, id_halaman) => {
    try {
      const body = {
        id_tema,
        id_halaman,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_halaman: Joi.number().required(),
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

      const list = await prisma.gelombang.findMany({
        where: {
          tema_halaman: {
            id_tema: body.id_tema,
            id_halaman: body.id_halaman,
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

  listGelombangDosen = async (id_tema, id_halaman, id_dosen) => {
    try {
      const body = {
        id_tema,
        id_halaman,
        id_dosen,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_halaman: Joi.number().required(),
        id_dosen: Joi.number().required(),
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

      const list = await prisma.gelombang.findMany({
        where: {
          tema_halaman: {
            id_tema: body.id_tema,
            id_halaman: body.id_halaman,
          },
        },
        include: {
          proposal: {
            where: {
              id_dosen: body.id_dosen,
            },
            include: {
              kecamatan: {
                select: {
                  nama: true,
                  kabupaten: {
                    select: {
                      bappeda: {
                        select: {
                          nama_kabupaten: true,
                        },
                      },
                    },
                  },
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
      console.error("listGelombangDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listGelombangMahasiswa = async (id_tema, id_halaman, id_mahasiswa) => {
    try {
      const body = {
        id_tema,
        id_halaman,
        id_mahasiswa,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
        id_halaman: Joi.number().required(),
        id_mahasiswa: Joi.number().required(),
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

      const list = await prisma.gelombang.findMany({
        where: {
          tema_halaman: {
            id_tema: body.id_tema,
            id_halaman: body.id_halaman,
          },
        },
        include: {
          mahasiswa_kecamatan: {
            where: {
              id_mahasiswa: body.id_mahasiswa,
            },
            include: {
              kecamatan: {
                select: {
                  nama: true,
                  kabupaten: {
                    select: {
                      bappeda: {
                        select: {
                          nama_kabupaten: true,
                        },
                      },
                    },
                  },
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
      console.error("listGelombangMahasiswa module error ", error);

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
        check.tgl_mulai &&
        check.tgl_akhir &&
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

  deleteGelombang = async (id_gelombang) => {
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
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (check.status || check.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Gelombang masih dalam status aktif!",
        };
      }

      await prisma.gelombang.delete({
        where: {
          id_gelombang,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteGelombang module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _gelombang();
