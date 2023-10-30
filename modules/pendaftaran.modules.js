const { prisma, Prisma, Role } = require("../helpers/database");
const Joi = require("joi");

class _pendaftaran {
  addPendaftaran = async (id_user, body) => {
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

      const checkMahasiswaKecamatan =
        await prisma.mahasiswa_kecamatan.findFirst({
          where: {
            id_mahasiswa: checkMahasiswa.id_mahasiswa,
            id_gelombang: body.id_gelombang,
          },
          select: {
            id_mahasiswa_kecamatan: true,
          },
        });

      if (!checkMahasiswa || !checkKecamatan || !checkGelombang) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (checkMahasiswa.status === 2 || checkMahasiswaKecamatan) {
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
      console.error("addPendaftaran module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  accPendaftaran = async (id_user, id_mahasiswa_kecamatan) => {
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

      console.error("accPendaftaran module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decPendaftaran = async (id_user, id_mahasiswa_kecamatan) => {
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
      console.error("decPendaftaran module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePendaftaran = async (id_user, id_mahasiswa_kecamatan) => {
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

      const user = await prisma.user.findUnique({
        where: {
          id_user,
        },
      });

      const mahasiswaKecamatan = await prisma.mahasiswa_kecamatan.findUnique({
        where: {
          id_mahasiswa_kecamatan,
        },
      });

      if (!mahasiswaKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (user.role === Role.MAHASISWA && mahasiswaKecamatan.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Pendaftaran sudah disetujui",
        };
      }

      const nilai = await prisma.nilai.findFirst({
        where: {
          id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
        },
      });

      if (nilai) {
        await prisma.nilai.deleteMany({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      const laporan = await prisma.laporan.findFirst({
        where: {
          id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
        },
      });

      if (laporan) {
        await prisma.laporan.deleteMany({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      if (mahasiswaKecamatan.status == 1) {
        await prisma.mahasiswa_kecamatan_active.delete({
          where: {
            id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
          },
        });
      }

      await prisma.mahasiswa_kecamatan.delete({
        where: {
          id_mahasiswa_kecamatan,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: mahasiswaKecamatan.id_mahasiswa,
        },
        data: {
          status: 0,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePendaftaran module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _pendaftaran();
