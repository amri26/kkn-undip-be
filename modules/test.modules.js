const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _test {
  listMahasiswa = async (id_kecamatan) => {
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

      const get = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan,
        },
        select: {
          nama: true,
          kabupaten: {
            select: {
              nama: true,
            },
          },
        },
      });

      const list = await prisma.mahasiswa_kecamatan_active.findMany({
        where: {
          id_kecamatan,
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
              nilai: true,
            },
          },
        },
      });

      return {
        status: true,
        data: { kecamatan: get, list },
      };
    } catch (error) {
      console.error("listTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addMhs = async (file, id_kecamatan, id_gelombang) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["mahasiswa"],
        columnToKey: {
          B: "nim",
          C: "nama",
          E: "kelamin",
          F: "hp",
          H: "prodi",
          I: "pembekalan",
          J: "upacara",
          K: "kehadiran",
          L: "lrk",
          M: "integritas",
          N: "sosial",
          O: "lpk",
          P: "ujian",
          Q: "tugas",
          R: "uts",
          S: "uas",
          T: "akhir",
          U: "huruf",
        },
      });

      for (let i = 0; i < result.mahasiswa.length; i++) {
        const e = result.mahasiswa[i];

        console.log(e);

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nim),
          },
          select: {
            username: true,
          },
        });

        const checkMahasiswa = await prisma.mahasiswa.findUnique({
          where: {
            nim: String(e.nim),
          },
          select: {
            nim: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkUser.username,
          };
        } else if (checkMahasiswa) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM " + checkMahasiswa.nim,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nim),
            password: bcrypt.hashSync(String(e.nim), 10),
            role: Role.MAHASISWA,
          },
          select: {
            id_user: true,
          },
        });

        const addMhs = await prisma.mahasiswa.create({
          data: {
            nama: e.nama,
            nim: String(e.nim),
            id_user: addUser.id_user,
            status: 2,
            jenis_kelamin: Number(e.kelamin),
            no_hp: String(e.hp),
            id_prodi: Number(e.prodi),
            alamat:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare porta libero, eu feugiat enim ultrices ac. In ut tellus.",
            alamat_ortu:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare porta libero, eu feugiat enim ultrices ac. In ut tellus.",
            alamat_cp_urgent:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare porta libero, eu feugiat enim ultrices ac. In ut tellus.",
            hubungan: "Lorem ipsum dolor sit amet.",
            nama_ortu: "Lorem ipsum dolor sit amet.",
            nama_cp_urgent: "Lorem ipsum dolor sit amet.",
            no_hp_ortu: "999999999999",
            no_hp_cp_urgent: "999999999999",
          },
          select: {
            id_mahasiswa: true,
          },
        });

        await prisma.mahasiswa_kecamatan.create({
          data: {
            id_mahasiswa: addMhs.id_mahasiswa,
            id_kecamatan,
            id_gelombang,
            status: 1,
          },
        });

        await prisma.mahasiswa_kecamatan_active.create({
          data: {
            id_mahasiswa: addMhs.id_mahasiswa,
            id_kecamatan,
          },
        });

        await prisma.nilai.create({
          data: {
            id_mahasiswa: addMhs.id_mahasiswa,
            pembekalan:
              e.pembekalan != " " || e.pembekalan != undefined
                ? e.pembekalan
                : 0,
            upacara: e.upacara != " " || e.upacara != undefined ? e.upacara : 0,
            kehadiran_dilokasi:
              e.kehadiran != " " || e.kehadiran != undefined ? e.kehadiran : 0,
            lrk: e.lrk != " " || e.lrk != undefined ? e.lrk : 0,
            integritas:
              e.integritas != " " || e.integritas != undefined
                ? e.integritas
                : 0,
            sosial_kemasyarakatan:
              e.sosial != " " || e.sosial != undefined ? e.sosial : 0,
            lpk: e.lpk != " " || e.lpk != undefined ? e.lpk : 0,
            ujian_akhir: e.ujian != "" || e.ujian != undefined ? e.ujian : 0,
            tugas:
              e.tugas != " " || e.tugas != undefined ? Math.round(e.tugas) : 0,
            uts: e.uts != " " || e.uts != undefined ? Math.round(e.uts) : 0,
            uas: e.uas != " " || e.uas != undefined ? Math.round(e.uas) : 0,
            nilai_akhir:
              e.akhir != " " || e.akhir != undefined ? Math.round(e.akhir) : 0,
            nilai_huruf: e.huruf != " " || e.huruf != undefined ? e.huruf : "",
          },
        });
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("addMhs module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addDsn = async (file, id_gelombang) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["dosen"],
        columnToKey: {
          B: "nip",
          C: "nama",
          D: "kelamin",
          E: "hp",
          F: "kecamatan",
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

        const addDsn = await prisma.dosen.create({
          data: {
            id_user: addUser.id_user,
            nama: e.nama,
            nip: String(e.nip),
            alamat:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare porta libero, eu feugiat enim ultrices ac. In ut tellus.",
            jenis_kelamin: Number(e.kelamin),
            no_hp: String(e.hp),
          },
          select: {
            id_dosen: true,
          },
        });

        await prisma.proposal.create({
          data: {
            id_dosen: addDsn.id_dosen,
            id_kecamatan: Number(e.kecamatan),
            id_gelombang,
            id_dokumen: 1,
            komentar:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta orci at ligula posuere tempus. Donec nec hendrerit dui. Vivamus ullamcorper lacinia bibendum. Aenean consectetur, ante vel vehicula pulvinar, ipsum ex finibus velit, quis rhoncus felis augue id metus. Proin sit amet sem eget mauris accumsan varius. Duis enim justo.",
            rekomendasi: true,
            status: 1,
          },
        });
      }

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("addDsn module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _test();
