const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _reportase {
  listReportase = async () => {
    try {
      const list = await prisma.reportase.findMany({
        include: {
          mahasiswa: true,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportaseDosen = async (id_user, id_kecamatan) => {
    try {
      const body = {
        id_user,
        id_kecamatan,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_kecamatan: Joi.number().required(),
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

      const checkProposal = await prisma.proposal.findFirst({
        where: {
          id_dosen: checkDosen.id_dosen,
          id_kecamatan: body.id_kecamatan,
        },
        select: {
          status: true,
        },
      });

      if (!checkProposal) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (checkProposal.status !== 1) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan data is not approved",
        };
      }

      const list = await prisma.reportase.findMany({
        where: {
          mahasiswa: {
            mahasiswa_kecamatan_active: {
              id_kecamatan: body.id_kecamatan,
            },
          },
        },
        include: {
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
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReportaseDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportaseMahasiswa = async (id_user) => {
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

      const list = await prisma.reportase.findMany({
        where: {
          id_mahasiswa: checkMahasiswa.id_mahasiswa,
        },
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReportaseMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportaseKecamatan = async (id_kecamatan) => {
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

      const listReportase = await prisma.reportase.findMany({
        where: {
          mahasiswa: {
            mahasiswa_kecamatan_active: {
              id_kecamatan,
            },
          },
        },
        include: {
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
      });

      return {
        status: true,
        data: listReportase,
      };
    } catch (error) {
      console.error("listReportaseKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getReportase = async (id_reportase) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_reportase);

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

      const reportase = await prisma.reportase.findUnique({
        where: {
          id_reportase,
        },
        include: {
          mahasiswa: {
            select: {
              nama: true,
              nim: true,
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
              mahasiswa_kecamatan_active: {
                select: {
                  kecamatan: {
                    select: {
                      nama: true,
                      kabupaten: {
                        select: {
                          nama: true,
                          tema: {
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
            },
          },
        },
      });

      reportase.tema =
        reportase.mahasiswa.mahasiswa_kecamatan_active.kecamatan.kabupaten.tema.nama;
      reportase.kabupaten =
        reportase.mahasiswa.mahasiswa_kecamatan_active.kecamatan.kabupaten.nama;
      reportase.kecamatan =
        reportase.mahasiswa.mahasiswa_kecamatan_active.kecamatan.nama;
      reportase.fakultas = reportase.mahasiswa.prodi?.fakultas.nama;
      reportase.prodi = reportase.mahasiswa.prodi?.nama;

      delete reportase.mahasiswa.mahasiswa_kecamatan_active;
      delete reportase.mahasiswa.prodi;

      return {
        status: true,
        data: reportase,
      };
    } catch (error) {
      console.error("getReportase module error ", error);

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
        kategori: Joi.number().required(),
        judul: Joi.string().required(),
        link_publikasi: Joi.string().required(),
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
          kategori: body.kategori,
          judul: body.judul,
          link_publikasi: body.link_publikasi,
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

  editReportase = async (id_user, id_reportase, body) => {
    try {
      body = {
        id_user,
        id_reportase,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_reportase: Joi.number().required(),
        id_tema: Joi.number().required(),
        judul: Joi.string().required(),
        link_publikasi: Joi.string().required(),
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

      await prisma.reportase.update({
        where: {
          id_reportase: body.id_reportase,
        },
        data: {
          judul: body.judul,
          link_publikasi: body.link_publikasi,
          isi: body.isi,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteReportase = async (id_reportase) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_reportase);

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

      const reportase = await prisma.reportase.findUnique({
        where: {
          id_reportase,
        },
      });

      if (!reportase) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      await prisma.reportase.delete({
        where: {
          id_reportase,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  evaluateReportase = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_reportase: Joi.number().required(),
        komentar: Joi.string(),
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

      const checkReportase = await prisma.reportase.findUnique({
        where: {
          id_reportase: body.id_reportase,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      if (!checkDosen || !checkReportase) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkReportase.id_mahasiswa,
          },
          select: {
            id_kecamatan: true,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.reportase.update({
        where: {
          id_reportase: body.id_reportase,
        },
        data: {
          komentar: body.komentar,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("evaluateReportase module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _reportase();
