const { prisma, Prisma } = require("../helpers/database");
const { uploadDrive } = require("../helpers/upload");
const Joi = require("joi");

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

  listMahasiswa = async (id_user, id_kecamatan) => {
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

      const list = await prisma.mahasiswa_kecamatan.findMany({
        where: {
          id_kecamatan: body.id_kecamatan,
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
          gelombang: {
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
      console.error("listMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listProposal = async (id_user, id_tema) => {
    try {
      const body = {
        id_user,
        id_tema,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const list = await prisma.proposal.findMany({
        where: {
          kecamatan: {
            kabupaten: {
              id_tema,
            },
          },
          id_dosen: checkDosen.id_dosen,
        },
        include: {
          dosen: true,
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  tema: {
                    select: {
                      periode: true,
                    },
                  },
                  nama: true,
                },
              },
            },
          },
          gelombang: {
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
      console.error("listProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addProposal = async (file, id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const checkDosen = await prisma.dosen.findUnique({
        where: {
          id_user,
        },
        select: {
          id_dosen: true,
        },
      });

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: Number(body.id_kecamatan),
        },
        select: {
          status: true,
        },
      });

      const checkGelombang = await prisma.gelombang.findUnique({
        where: {
          id_gelombang: Number(body.id_gelombang),
        },
        select: {
          status: true,
        },
      });

      if (!checkDosen || !checkGelombang || !checkKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (!checkGelombang.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Gelombang data is not activated",
        };
      } else if (checkKecamatan.status !== 1) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan data is not approved",
        };
      }

      const fileDrive = await uploadDrive(
        file,
        "PROPOSAL",
        process.env.PROPOSAL_FOLDER_ID
      );

      const add = await prisma.dokumen.create({
        data: {
          id_drive: fileDrive.data.id,
        },
        select: {
          id_dokumen: true,
        },
      });

      await prisma.proposal.create({
        data: {
          id_dosen: checkDosen.id_dosen,
          id_kecamatan: Number(body.id_kecamatan),
          id_gelombang: Number(body.id_gelombang),
          id_dokumen: add.id_dokumen,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  accMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
    try {
      const body = {
        id_user,
        id_mahasiswa_kecamatan,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_mahasiswa_kecamatan: Joi.number().required(),
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

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan.findUnique({
          where: {
            id_mahasiswa_kecamatan,
          },
          select: {
            id_kecamatan: true,
            id_mahasiswa: true,
            status: true,
          },
        });

      if (!checkMahasiswaKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
        select: {
          proposal: {
            where: {
              status: 1,
            },
            select: {
              id_dosen: true,
            },
          },
        },
      });

      if (!checkKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (
        !checkKecamatan.proposal.some(
          (i) => i.id_dosen === checkDosen.id_dosen
        ) ||
        checkMahasiswaKecamatan.status === -1
      ) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      const checkMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
        },
        select: {
          status: true,
        },
      });

      if (checkMahasiswa.status === 2) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Mahasiswa data is already registered",
        };
      }

      await prisma.mahasiswa_kecamatan_active.create({
        data: {
          id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
      });

      await prisma.nilai.create({
        data: {
          id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
        },
      });

      await prisma.mahasiswa_kecamatan.update({
        where: {
          id_mahasiswa_kecamatan,
        },
        data: {
          status: 1,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
        },
        data: {
          status: 2,
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

      console.error("accMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
    try {
      const body = {
        id_user,
        id_mahasiswa_kecamatan,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_mahasiswa_kecamatan: Joi.number().required(),
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

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan.findUnique({
          where: {
            id_mahasiswa_kecamatan,
          },
          select: {
            id_kecamatan: true,
            id_mahasiswa: true,
            status: true,
          },
        });

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
        select: {
          proposal: {
            where: {
              status: 1,
            },
            select: {
              id_dosen: true,
            },
          },
        },
      });

      if (
        !checkKecamatan.proposal.some(
          (i) => i.id_dosen === checkDosen.id_dosen
        ) ||
        checkMahasiswaKecamatan.status === 1
      ) {
        return {
          status: false,
          code: 403,
          error: "Forbidden",
        };
      }

      await prisma.mahasiswa_kecamatan.update({
        where: {
          id_mahasiswa_kecamatan,
        },
        data: {
          status: -1,
        },
      });

      const listMahasiswaKecamatan = await prisma.mahasiswa_kecamatan.findMany({
        where: {
          id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
          status: 0,
        },
        select: {
          status: true,
        },
      });

      if (listMahasiswaKecamatan.length === 0) {
        await prisma.mahasiswa.update({
          where: {
            id_mahasiswa: checkMahasiswaKecamatan.id_mahasiswa,
          },
          data: {
            status: 0,
          },
        });
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("decMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  evaluateLaporan = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_laporan: Joi.number().required(),
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

      const checkLaporan = await prisma.laporan.findUnique({
        where: {
          id_laporan: body.id_laporan,
        },
        select: {
          id_mahasiswa: true,
        },
      });

      if (!checkDosen || !checkLaporan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan_active.findUnique({
          where: {
            id_mahasiswa: checkLaporan.id_mahasiswa,
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

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
        },
        select: {
          proposal: {
            where: {
              status: 1,
            },
            select: {
              id_dosen: true,
            },
          },
        },
      });

      if (!checkKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (
        !checkKecamatan.proposal.some((i) => i.id_dosen === checkDosen.id_dosen)
      ) {
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
          komentar: body.komentar,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("evaluateLaporan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listReportase = async (id_user, id_kecamatan) => {
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
      console.error("listReportase module error ", error);

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

module.exports = new _dosen();
