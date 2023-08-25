const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _tema {
  listTema = async () => {
    try {
      const list = await prisma.tema.findMany({
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      list.forEach((item) => {
        item.total_kabupaten = item.kabupaten.length;
        item.total_kecamatan = 0;
        item.total_desa = 0;
        item.kabupaten.forEach((kab) => {
          item.total_kecamatan += kab.kecamatan.length;

          kab.kecamatan.forEach((kec) => {
            item.total_desa += kec.desa.length;
          });
        });
      });

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

  listTemaActive = async () => {
    try {
      const list = await prisma.tema.findMany({
        where: {
          status: true,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      list.forEach((item) => {
        item.total_kabupaten = item.kabupaten.length;
        item.total_kecamatan = 0;
        item.total_desa = 0;
        item.kabupaten.forEach((kab) => {
          item.total_kecamatan += kab.kecamatan.length;

          kab.kecamatan.forEach((kec) => {
            item.total_desa += kec.desa.length;
          });
        });
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTemaActive module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listTemaDosen = async (id_user) => {
    try {
      const body = {
        id_user,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const checkDosen = await prisma.dosen.findUnique({
        where: {
          id_user,
        },
        select: {
          id_dosen: true,
        },
      });

      if (!checkDosen) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const proposal = await prisma.proposal.findMany({
        where: {
          id_dosen: checkDosen.id_dosen,
          status: 1,
        },
        select: {
          kecamatan: {
            select: {
              kabupaten: {
                select: {
                  tema: true,
                },
              },
            },
          },
        },
      });

      const id_tema = proposal.map(
        (item) => item.kecamatan.kabupaten.tema.id_tema
      );

      const list = await prisma.tema.findMany({
        where: {
          id_tema: {
            in: id_tema,
          },
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listTemaDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getTema = async (id_tema) => {
    try {
      const body = {
        id_tema,
      };

      const schema = Joi.object({
        id_tema: Joi.number().required(),
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

      const tema = await prisma.tema.findUnique({
        where: {
          id_tema,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              kecamatan: {
                select: {
                  nama: true,
                  desa: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        status: true,
        data: tema,
      };
    } catch (error) {
      console.error("getTema module error ", error);

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

  deleteTema = async (id_tema) => {
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
          error: "Tema masih dalam status aktif!",
        };
      }

      await prisma.tema_halaman.deleteMany({
        where: {
          id_tema,
        },
      });

      await prisma.tema.delete({
        where: {
          id_tema,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _tema();
