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

  editNilai = async (id_user, body) => {
    try {
      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_nilai: Joi.number().required(),
        pembekalan: Joi.number(),
        upacara: Joi.number(),
        kehadiran_dilokasi: Joi.number(),
        lrk: Joi.number(),
        integritas: Joi.number(),
        sosial_kemasyarakatan: Joi.number(),
        lpk: Joi.number(),
        ujian_akhir: Joi.number(),
        tugas: Joi.number(),
        uts: Joi.number(),
        uas: Joi.number(),
        nilai_akhir: Joi.number(),
        nilai_huruf: Joi.string(),
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

      await prisma.nilai.update({
        where: {
          id_nilai: body.id_nilai,
        },
        data: {
          pembekalan: body.pembekalan,
          upacara: body.upacara,
          kehadiran_dilokasi: body.kehadiran_dilokasi,
          lrk: body.lrk,
          integritas: body.integritas,
          sosial_kemasyarakatan: body.sosial_kemasyarakatan,
          lpk: body.lpk,
          ujian_akhir: body.ujian_akhir,
          tugas: body.tugas,
          uts: body.uts,
          uas: body.uas,
          nilai_akhir: body.nilai_akhir,
          nilai_huruf: body.nilai_huruf,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editNilai module error ", error);

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
