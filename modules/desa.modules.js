const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _desa {
  listDesa = async () => {
    try {
      const list = await prisma.desa.findMany({
        include: {
          kecamatan: {
            include: {
              kabupaten: {
                select: {
                  nama: true,
                  tema: true,
                },
              },
            },
          },
        },
      });

      list.forEach((desa) => {
        desa.nama_kecamatan = desa.kecamatan.nama;
        desa.nama_kabupaten = desa.kecamatan.kabupaten.nama;
        desa.id_tema = desa.kecamatan.kabupaten.tema.id_tema;
        desa.nama_tema = desa.kecamatan.kabupaten.tema.nama;
        desa.periode = desa.kecamatan.kabupaten.tema.periode;

        delete desa.kecamatan;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listDesa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listDesaKecamatan = async (id_kecamatan) => {
    try {
      const schema = Joi.number().required();

      const validate = schema.validate(id_kecamatan);

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

      const list = await prisma.desa.findMany({
        where: {
          id_kecamatan,
        },
        include: {
          kecamatan: {
            include: {
              kabupaten: {
                select: {
                  nama: true,
                  tema: true,
                },
              },
            },
          },
        },
      });

      list.forEach((desa) => {
        desa.nama_kecamatan = desa.kecamatan.nama;
        desa.nama_kabupaten = desa.kecamatan.kabupaten.nama;
        desa.id_tema = desa.kecamatan.kabupaten.tema.id_tema;
        desa.nama_tema = desa.kecamatan.kabupaten.tema.nama;
        desa.periode = desa.kecamatan.kabupaten.tema.periode;

        delete desa.kecamatan;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listDesaKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getDesa = async (id_desa) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_desa);

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

      const desa = await prisma.desa.findUnique({
        where: {
          id_desa,
        },
        include: {
          kecamatan: {
            include: {
              kabupaten: {
                select: {
                  nama: true,
                  tema: true,
                },
              },
            },
          },
        },
      });

      if (!desa) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      desa.nama_kecamatan = desa.kecamatan.nama;
      desa.nama_kabupaten = desa.kecamatan.kabupaten.nama;
      desa.id_tema = desa.kecamatan.kabupaten.tema.id_tema;
      desa.nama_tema = desa.kecamatan.kabupaten.tema.nama;
      desa.periode = desa.kecamatan.kabupaten.tema.periode;

      delete desa.kecamatan;

      return {
        status: true,
        data: desa,
      };
    } catch (error) {
      console.error("getDesa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addDesa = async (body) => {
    try {
      const schema = Joi.object({
        id_kecamatan: Joi.number().required(),
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

      const check = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: Number(body.id_kecamatan),
        },
        select: {
          id_kecamatan: true,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data kecamatan not found",
        };
      }

      await prisma.desa.create({
        data: {
          id_kecamatan: check.id_kecamatan,
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addDesa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editDesa = async (id_desa, body) => {
    try {
      body = {
        id_desa,
        ...body,
      };

      const schema = Joi.object({
        id_desa: Joi.number().required(),
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

      await prisma.desa.update({
        where: {
          id_desa,
        },
        data: {
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editDesa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteDesa = async (id_desa) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_desa);

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

      const check = await prisma.desa.findUnique({
        where: {
          id_desa,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      await prisma.desa.delete({
        where: {
          id_desa,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteDesa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _desa();
