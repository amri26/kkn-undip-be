const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _kecamatan {
  listKecamatan = async () => {
    try {
      const list = await prisma.kecamatan.findMany({
        include: {
          kabupaten: {
            select: {
              nama: true,
              tema: true,
            },
          },
          desa: {
            select: {
              nama: true,
            },
          },
        },
      });

      list.forEach((kecamatan) => {
        kecamatan.nama_kabupaten = kecamatan.kabupaten.nama;
        kecamatan.nama_tema = kecamatan.kabupaten.tema.nama;
        kecamatan.periode = kecamatan.kabupaten.tema.periode;

        delete kecamatan.kabupaten;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listKecamatanKabupaten = async (id_kabupaten) => {
    try {
      const schema = Joi.number().required();

      const validate = schema.validate(id_kabupaten);

      if (validate.error) {
        const errorDetails = validate.error.details.map(
          (detail) => detail.message
        );

        return {
          status: false,
          code: 422,
          error: errorDetails.join(", "),
        };
      }

      const list = await prisma.kecamatan.findMany({
        where: {
          id_kabupaten,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              tema: true,
            },
          },
          desa: {
            select: {
              nama: true,
            },
          },
        },
      });

      list.forEach((kecamatan) => {
        kecamatan.nama_kabupaten = kecamatan.kabupaten.nama;
        kecamatan.nama_tema = kecamatan.kabupaten.tema.nama;
        kecamatan.periode = kecamatan.kabupaten.tema.periode;

        delete kecamatan.kabupaten;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listKecamatanKabupaten module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getKecamatan = async (id_kecamatan) => {
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

      const kecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan,
        },
        include: {
          kabupaten: {
            select: {
              nama: true,
              tema: true,
            },
          },
          desa: {
            select: {
              nama: true,
            },
          },
          korwil: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!kecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      kecamatan.nama_kabupaten = kecamatan.kabupaten.nama;
      kecamatan.id_tema = kecamatan.kabupaten.tema.id_tema;
      kecamatan.nama_tema = kecamatan.kabupaten.tema.nama;
      kecamatan.periode = kecamatan.kabupaten.tema.periode;
      kecamatan.nama_korwil = kecamatan.korwil?.nama ?? "-";

      delete kecamatan.kabupaten;
      delete kecamatan.korwil;

      return {
        status: true,
        data: kecamatan,
      };
    } catch (error) {
      console.error("getKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getKecamatanMahasiswa = async (id_user) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_user);

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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
          select: {
            id_kecamatan: true,
          },
        });

      const kecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
        include: {
          mahasiswa_kecamatan_active: {
            select: {
              mahasiswa: {
                include: {
                  prodi: {
                    select: {
                      nama: true,
                      fakultas: {
                        select: {
                          nama: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          kabupaten: {
            select: {
              nama: true,
            },
          },
          desa: {
            select: {
              nama: true,
            },
          },
          proposal: {
            select: {
              dosen: true,
            },
          },
        },
      });

      kecamatan.kabupaten = kecamatan.kabupaten.nama;
      kecamatan.desa = kecamatan.desa.map((item) => item.nama);
      kecamatan.dosen = kecamatan.proposal.map((item) => item.dosen);
      kecamatan.mahasiswa = kecamatan.mahasiswa_kecamatan_active.map((item) => {
        item.mahasiswa.fakultas = item.mahasiswa.prodi?.fakultas.nama;
        item.mahasiswa.prodi = item.mahasiswa.prodi?.nama;
        return item.mahasiswa;
      });

      delete kecamatan.mahasiswa_kecamatan_active;
      delete kecamatan.proposal;

      return {
        status: true,
        data: kecamatan,
      };
    } catch (error) {
      console.error("getKecamatanMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addKecamatan = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_kabupaten: Joi.number().required(),
        nama: Joi.string().required(),
        potensi: Joi.string().required(),
        desa: Joi.array().items(
          Joi.object({
            nama: Joi.string().required(),
          })
        ),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        radius: Joi.number().required(),
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

      const check = await prisma.kabupaten.findUnique({
        where: {
          id_kabupaten: body.id_kabupaten,
        },
        select: {
          bappeda: {
            select: {
              id_user: true,
            },
          },
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (check.bappeda.id_user !== id_user) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      const add = await prisma.kecamatan.create({
        data: {
          id_kabupaten: body.id_kabupaten,
          nama: body.nama,
          potensi: body.potensi,
          latitude: body.latitude,
          longitude: body.longitude,
          radius: body.radius,
        },
        select: {
          id_kecamatan: true,
        },
      });

      body.desa.forEach(async (e) => {
        await prisma.desa.create({
          data: {
            id_kecamatan: add.id_kecamatan,
            nama: e.nama,
          },
        });
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editKecamatan = async (id_kecamatan, body) => {
    try {
      body = {
        id_kecamatan,
        ...body,
      };

      const schema = Joi.object({
        id_kecamatan: Joi.number().required(),
        nama: Joi.string().required(),
        potensi: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        radius: Joi.number().required(),
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
          nama: body.nama,
          potensi: body.potensi,
          latitude: body.latitude,
          longitude: body.longitude,
          radius: body.radius,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editKecamatan module error ", error);

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

  deleteKecamatan = async (id_kecamatan) => {
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

      const check = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (check.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Kecamatan masih dalam status aktif!",
        };
      }

      await prisma.kecamatan.delete({
        where: {
          id_kecamatan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteKecamatan module error ", error);

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
}

module.exports = new _kecamatan();
