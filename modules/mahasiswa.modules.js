const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _mahasiswa {
  listMahasiswa = async () => {
    try {
      const list = await prisma.mahasiswa.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaUnregistered = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 0,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaUnregistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaRegistered = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 1,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaAccepted = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 2,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaAccepted module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaRegisteredByKecamatan = async (id_kecamatan) => {
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

      const list = await prisma.mahasiswa_kecamatan.findMany({
        where: {
          id_kecamatan,
        },
        include: {
          mahasiswa: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listMahasiswaAcceptedByKecamatan = async (id_kecamatan) => {
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

      const list = await prisma.mahasiswa_kecamatan_active.findMany({
        where: {
          id_kecamatan,
        },
        include: {
          mahasiswa: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listMahasiswaRegistered module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  daftarLokasi = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_tema_halaman: Joi.number().required(),
        id_kecamatan: Joi.number().required(),
        id_gelombang: Joi.number().required(),
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

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
        select: {
          id_mahasiswa: true,
          status: true,
        },
      });

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: body.id_kecamatan,
        },
        select: {
          status: true,
        },
      });

      const checkGelombang = await prisma.gelombang.findUnique({
        where: {
          id_gelombang: body.id_gelombang,
        },
        select: {
          status: true,
          id_tema_halaman: true,
        },
      });

      if (!checkMahasiswa || !checkKecamatan || !checkGelombang) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (checkMahasiswa.status === 2) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Mahasiswa data is already registered",
        };
      } else if (checkGelombang.id_tema_halaman !== body.id_tema_halaman) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, data doesn't match",
        };
      } else if (!checkKecamatan.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan data is not approved",
        };
      } else if (!checkGelombang.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Gelombang data is not activated",
        };
      }

      await prisma.mahasiswa_kecamatan.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          id_kecamatan: body.id_kecamatan,
          id_gelombang: body.id_gelombang,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_user,
        },
        data: {
          status: 1,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("daftarLokasi module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listLaporan = async (id_user, type) => {
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

      if (!checkMahasiswa) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      let list = [];
      if (type === "lrk") {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
          select: {
            id_laporan: true,
            id_mahasiswa: true,
            potensi: true,
            program: true,
            sasaran: true,
            metode: true,
            luaran: true,
            created_at: true,
          },
        });
      } else {
        list = await prisma.laporan.findMany({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
          },
        });
      }

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editLRK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        potensi: Joi.string().required(),
        program: Joi.string().required(),
        sasaran: Joi.string().required(),
        metode: Joi.string().required(),
        luaran: Joi.string().required(),
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
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          potensi: body.potensi,
          program: body.program,
          sasaran: body.sasaran,
          metode: body.metode,
          luaran: body.luaran,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLRK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addLPK = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        id_laporan: Joi.number().required(),
        pelaksanaan: Joi.string(),
        capaian: Joi.string(),
        hambatan: Joi.string(),
        kelanjutan: Joi.string(),
        metode: Joi.string(),
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
        });

      const checkLaporan = await prisma.laporan.findUnique({
        where: {
          id_laporan: body.id_laporan,
        },
      });

      if (!checkMahasiswaKecamatan || !checkLaporan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.laporan.update({
        where: {
          id_laporan: body.id_laporan,
        },
        data: {
          pelaksanaan: body.pelaksanaan,
          capaian: body.capaian,
          hambatan: body.hambatan,
          kelanjutan: body.kelanjutan,
          metode: body.metode,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addLPK module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReportase = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
        judul: Joi.string().required(),
        isi: Joi.string().required(),
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
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.reportase.create({
        data: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
          judul: body.judul,
          isi: body.isi,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _mahasiswa();
