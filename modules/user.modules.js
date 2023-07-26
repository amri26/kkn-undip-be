const { prisma, Role } = require("../helpers/database");
const Joi = require("joi");

class _user {
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

  getUser = async (id_user, role) => {
    try {
      let get = {};
      let tema;
      switch (role) {
        case Role.ADMIN:
          get = await prisma.admin.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.BAPPEDA:
          get = await prisma.bappeda.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.REVIEWER:
          get = await prisma.reviewer.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.DOSEN:
          get = await prisma.dosen.findUnique({
            where: {
              id_user,
            },
          });

          tema = await prisma.proposal.findMany({
            where: {
              id_dosen: get.id_dosen,
            },
            select: {
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      tema: {
                        select: {
                          id_tema: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          get = {
            ...get,
            id_tema: tema.map((item) => item.kecamatan.kabupaten.tema.id_tema),
          };

          break;
        case Role.MAHASISWA:
          get = await prisma.mahasiswa.findUnique({
            where: {
              id_user,
            },
            include: {
              prodi: {
                select: {
                  fakultas: {
                    select: {
                      id_fakultas: true,
                    },
                  },
                },
              },
            },
          });

          get.id_fakultas = get.prodi?.fakultas.id_fakultas;
          delete get.prodi;

          tema = await prisma.mahasiswa_kecamatan_active.findUnique({
            where: {
              id_mahasiswa: get.id_mahasiswa,
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

          get = {
            ...get,
            id_tema: tema?.kecamatan.kabupaten.tema.id_tema,
            tema: tema?.kecamatan.kabupaten.tema,
          };

          break;
        default:
          get = {
            nama: "Super Administrator",
          };
          break;
      }

      return {
        status: true,
        data: get,
      };
    } catch (error) {
      console.error("getUser auth module Error: ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editUser = async (id_user, role, body) => {
    try {
      body = {
        id_user,
        role,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        role: Joi.string().required(),
        nama: Joi.string(),
        id_prodi: Joi.number(),
        jenis_kelamin: Joi.number(),
        ttl: Joi.date(),
        no_hp: Joi.string(),
        alamat: Joi.string(),
        riwayat_penyakit: Joi.string(),
        nama_ortu: Joi.string(),
        no_hp_ortu: Joi.string(),
        alamat_ortu: Joi.string(),
        nama_cp_urgent: Joi.string(),
        no_hp_cp_urgent: Joi.string(),
        alamat_cp_urgent: Joi.string(),
        hubungan: Joi.string(),
        nama_kabupaten: Joi.string(),
        nama_pj: Joi.string(),
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

      switch (role) {
        case Role.ADMIN:
          await prisma.admin.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.BAPPEDA:
          await prisma.bappeda.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              no_hp: body.no_hp,
              alamat: body.alamat,
              nama_kabupaten: body.nama_kabupaten,
              nama_pj: body.nama_pj,
            },
          });

          break;
        case Role.REVIEWER:
          await prisma.reviewer.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.DOSEN:
          await prisma.dosen.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.MAHASISWA:
          await prisma.mahasiswa.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              id_prodi: body.id_prodi,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
              riwayat_penyakit: body.riwayat_penyakit,
              nama_ortu: body.nama_ortu,
              no_hp_ortu: body.no_hp_ortu,
              alamat_ortu: body.alamat_ortu,
              nama_cp_urgent: body.nama_cp_urgent,
              no_hp_cp_urgent: body.no_hp_cp_urgent,
              alamat_cp_urgent: body.alamat_cp_urgent,
              hubungan: body.hubungan,
            },
          });

          break;
        case Role.PIMPINAN:
          await prisma.pimpinan.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        default:
          break;
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editUser auth module Error: ", error);

      return {
        status: false,
        error,
      };
    }
  };
  getUser = async (id_user, role) => {
    try {
      let get = {};
      let tema;
      switch (role) {
        case Role.ADMIN:
          get = await prisma.admin.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.BAPPEDA:
          get = await prisma.bappeda.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.REVIEWER:
          get = await prisma.reviewer.findUnique({
            where: {
              id_user,
            },
          });
          break;
        case Role.DOSEN:
          get = await prisma.dosen.findUnique({
            where: {
              id_user,
            },
          });

          tema = await prisma.proposal.findMany({
            where: {
              id_dosen: get.id_dosen,
            },
            select: {
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      tema: {
                        select: {
                          id_tema: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          get = {
            ...get,
            id_tema: tema.map((item) => item.kecamatan.kabupaten.tema.id_tema),
          };

          break;
        case Role.MAHASISWA:
          get = await prisma.mahasiswa.findUnique({
            where: {
              id_user,
            },
            include: {
              prodi: {
                select: {
                  fakultas: {
                    select: {
                      id_fakultas: true,
                    },
                  },
                },
              },
            },
          });

          get.id_fakultas = get.prodi?.fakultas.id_fakultas;
          delete get.prodi;

          tema = await prisma.mahasiswa_kecamatan_active.findUnique({
            where: {
              id_mahasiswa: get.id_mahasiswa,
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

          get = {
            ...get,
            id_tema: tema?.kecamatan.kabupaten.tema.id_tema,
            tema: tema?.kecamatan.kabupaten.tema,
          };

          break;
        default:
          get = {
            nama: "Super Administrator",
          };
          break;
      }

      return {
        status: true,
        data: get,
      };
    } catch (error) {
      console.error("getUser auth module Error: ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editUser = async (id_user, role, body) => {
    try {
      body = {
        id_user,
        role,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        role: Joi.string().required(),
        nama: Joi.string(),
        id_prodi: Joi.number(),
        jenis_kelamin: Joi.number(),
        ttl: Joi.date(),
        no_hp: Joi.string(),
        alamat: Joi.string(),
        riwayat_penyakit: Joi.string(),
        nama_ortu: Joi.string(),
        no_hp_ortu: Joi.string(),
        alamat_ortu: Joi.string(),
        nama_cp_urgent: Joi.string(),
        no_hp_cp_urgent: Joi.string(),
        alamat_cp_urgent: Joi.string(),
        hubungan: Joi.string(),
        nama_kabupaten: Joi.string(),
        nama_pj: Joi.string(),
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

      switch (role) {
        case Role.ADMIN:
          await prisma.admin.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.BAPPEDA:
          await prisma.bappeda.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              no_hp: body.no_hp,
              alamat: body.alamat,
              nama_kabupaten: body.nama_kabupaten,
              nama_pj: body.nama_pj,
            },
          });

          break;
        case Role.REVIEWER:
          await prisma.reviewer.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.DOSEN:
          await prisma.dosen.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        case Role.MAHASISWA:
          await prisma.mahasiswa.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              id_prodi: body.id_prodi,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
              riwayat_penyakit: body.riwayat_penyakit,
              nama_ortu: body.nama_ortu,
              no_hp_ortu: body.no_hp_ortu,
              alamat_ortu: body.alamat_ortu,
              nama_cp_urgent: body.nama_cp_urgent,
              no_hp_cp_urgent: body.no_hp_cp_urgent,
              alamat_cp_urgent: body.alamat_cp_urgent,
              hubungan: body.hubungan,
            },
          });

          break;
        case Role.PIMPINAN:
          await prisma.pimpinan.update({
            where: {
              id_user,
            },
            data: {
              nama: body.nama,
              jenis_kelamin: body.jenis_kelamin,
              ttl: body.ttl,
              no_hp: body.no_hp,
              alamat: body.alamat,
            },
          });

          break;
        default:
          break;
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editUser auth module Error: ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _user();
