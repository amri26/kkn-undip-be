const { prisma } = require("../helpers/database");
const Joi = require("joi");
const ExcelJS = require("exceljs");
const { embedLinkDrive } = require("../helpers/upload");

class _exportToExcel {
  exportDataPendaftaranMahasiswa = async (res, id_kecamatan) => {
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

      let jml_laki = 0;
      let jml_perempuan = 0;
      let jml_total = list.length;

      list.forEach((item, i) => {
        if (item.mahasiswa.jenis_kelamin == 1) {
          jml_laki++;
        } else {
          jml_perempuan++;
        }

        item.no = i + 1;

        item.tema = item.kecamatan.kabupaten.tema.nama;
        item.kabupaten = item.kecamatan.kabupaten.nama;
        item.kecamatan = item.kecamatan.nama;

        item.nama = item.mahasiswa.nama;
        item.nim = item.mahasiswa.nim;
        item.jenis_kelamin =
          item.mahasiswa.jenis_kelamin == 1 ? "Laki-laki" : "Perempuan";
        item.ttl = item.mahasiswa.ttl;
        item.no_hp = item.mahasiswa.no_hp;
        item.alamat = item.mahasiswa.alamat;
        item.riwayat_penyakit = item.mahasiswa.riwayat_penyakit;
        item.nama_ortu = item.mahasiswa.nama_ortu;
        item.no_hp_ortu = item.mahasiswa.no_hp_ortu;
        item.alamat_ortu = item.mahasiswa.alamat_ortu;
        item.nama_cp_urgent = item.mahasiswa.nama_cp_urgent;
        item.no_hp_cp_urgent = item.mahasiswa.no_hp_cp_urgent;
        item.alamat_cp_urgent = item.mahasiswa.alamat_cp_urgent;

        item.jurusan = item.mahasiswa.prodi.nama;
        item.fakultas = item.mahasiswa.prodi.fakultas.nama;

        delete item.mahasiswa;
      });

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        "resources/assets/templates/Template Ekspor Data Peserta.xlsx"
      );

      const worksheet = workbook.worksheets[0];

      // judul
      worksheet.getCell("A2").value = list[0].tema + " UNIVERSITAS DIPONEGORO";
      worksheet.getCell("A3").value = "PERIODE";
      worksheet.getCell("A5").value = "KABUPATEN: " + list[0].kabupaten;
      worksheet.getCell("A6").value = "KECAMATAN: " + list[0].kecamatan;
      worksheet.getCell("A8").value = "JUMLAH: " + jml_total;
      worksheet.getCell("A9").value = "LAKI-LAKI: " + jml_laki;
      worksheet.getCell("A10").value = "PEREMPUAN: " + jml_perempuan;

      // style
      const style = {
        font: {
          name: "Roboto",
          size: 12,
        },
        alignment: {
          vertical: "middle",
        },
      };

      worksheet.columns = [
        { key: "no", width: 5, style },
        { key: "nim", width: 22, style },
        { key: "nama", width: 46, style },
        { key: "jenis_kelamin", width: 13, style },
        { key: "ttl", width: 40, style },
        { key: "no_hp", width: 23, style },
        { key: "alamat", width: 34, style },
        { key: "riwayat_penyakit", width: 23, style },
        { key: "fakultas", width: 27, style },
        { key: "jurusan", width: 26, style },
        { key: "nama_ortu", width: 23, style },
        { key: "alamat_ortu", width: 38, style },
        { key: "no_hp_ortu", width: 23, style },
        { key: "nama_cp_urgent", width: 46, style },
        { key: "no_hp_cp_urgent", width: 23, style },
        { key: "alamat_cp_urgent", width: 34, style },
        { key: "hubungan", width: 22, style },
      ];

      let startRow = 13;
      list.forEach((item, i) => {
        const row = worksheet.getRow(startRow + i);

        row.values = item;

        for (let i = 1; i <= 17; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      await workbook.xlsx.writeFile(`resources/assets/exports/export.xlsx`);

      res.download(
        `resources/assets/exports/export.xlsx`,
        "export.xlsx",
        (error) => {
          if (error) {
            console.error(
              "exportDataPendaftaranMahasiswa module error ",
              error
            );

            return {
              status: false,
              error,
            };
          }
        }
      );
    } catch (error) {
      console.error("exportDataPendaftaranMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  exportDataPendaftaranDosen = async (res, id_tema) => {
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

      const tema = await prisma.tema.findUnique({
        where: {
          id_tema,
        },
      });

      const list = await prisma.proposal.findMany({
        where: {
          status: 1,
        },
        include: {
          dosen: true,
          dokumen: {
            select: {
              id_drive: true,
            },
          },
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      });

      list.forEach((item, i) => {
        item.no = i + 1;

        item.nama = item.dosen.nama;
        item.nip = item.dosen.nip;
        item.jenis_kelamin =
          item.dosen.jenis_kelamin == 1 ? "Laki-laki" : "Perempuan";
        item.no_hp = item.dosen.no_hp;
        item.kabupaten = item.kecamatan.kabupaten.nama;
        let namaKecamatan = item.kecamatan.nama;
        item.kecamatan = namaKecamatan;

        delete item.dosen;
      });

      await Promise.all(
        list.map(async (item) => {
          item.link_proposal = (
            await embedLinkDrive(item.dokumen.id_drive)
          ).data.embedLink;
          delete item.dokumen;
        })
      );

      console.log(list);

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        "resources/assets/templates/Template Ekspor Data Dosen.xlsx"
      );

      const worksheet = workbook.worksheets[0];

      // judul
      worksheet.getCell("A2").value = tema.nama + " UNIVERSITAS DIPONEGORO";

      // style
      const style = {
        font: {
          name: "Roboto",
          size: 12,
        },
        alignment: {
          vertical: "middle",
        },
      };

      worksheet.columns = [
        { key: "no", width: 5, style },
        { key: "nip", width: 22, style },
        { key: "nama", width: 46, style },
        { key: "jenis_kelamin", width: 13, style },
        { key: "no_hp", width: 23, style },
        { key: "kabupaten", width: 28, style },
        { key: "kecamatan", width: 28, style },
        { key: "link_proposal", width: 37, style },
      ];

      let startRow = 6;
      list.forEach((item, i) => {
        const row = worksheet.getRow(startRow + i);

        row.values = item;

        for (let i = 1; i <= 8; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      await workbook.xlsx.writeFile(`resources/assets/exports/export.xlsx`);

      res.download(
        `resources/assets/exports/export.xlsx`,
        "export.xlsx",
        (error) => {
          if (error) {
            console.error(
              "exportDataPendaftaranMahasiswa module error ",
              error
            );

            return {
              status: false,
              error,
            };
          }
        }
      );
    } catch (error) {
      console.error("exportDataPendaftaranDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  exportDataNilai = async (res, id_kecamatan) => {
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

      const list = await prisma.nilai.findMany({
        where: {
          mahasiswa: {
            mahasiswa_kecamatan_active: {
              kecamatan: {
                id_kecamatan,
              },
            },
            // mahasiswa_kecamatan: {
            //   some: {
            //     status: 1,
            //     kecamatan: {
            //       id_kecamatan,
            //     },
            //   },
            // },
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

      list.forEach((item, i) => {
        item.no = i + 1;

        item.tema =
          item.mahasiswa.mahasiswa_kecamatan_active.kecamatan.kabupaten.tema.nama;
        item.kabupaten =
          item.mahasiswa.mahasiswa_kecamatan_active.kecamatan.kabupaten.nama;
        item.kecamatan =
          item.mahasiswa.mahasiswa_kecamatan_active.kecamatan.nama;

        item.nama = item.mahasiswa.nama;
        item.nim = item.mahasiswa.nim;
        item.jenis_kelamin =
          item.mahasiswa.jenis_kelamin == 1 ? "Laki-laki" : "Perempuan";
        item.no_hp = item.mahasiswa.no_hp;

        item.prodi = item.mahasiswa.prodi.nama;
        item.fakultas = item.mahasiswa.prodi.fakultas.nama;

        delete item.mahasiswa;
        delete item.mahasiswa_kecamatan_active;
      });

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        "resources/assets/templates/Template Ekspor Data Nilai.xlsx"
      );

      const worksheet = workbook.worksheets[0];

      // judul
      worksheet.getCell("A2").value = list[0].tema + " UNIVERSITAS DIPONEGORO";
      worksheet.getCell("A3").value = "KECAMATAN " + list[0].kecamatan;
      worksheet.getCell("A4").value = "KABUPATEN " + list[0].kabupaten;

      // style
      const style = {
        font: {
          name: "Roboto",
          size: 12,
        },
        alignment: {
          vertical: "middle",
        },
      };

      worksheet.columns = [
        { key: "no", width: 5, style },
        { key: "nim", width: 22, style },
        { key: "nama", width: 46, style },
        { key: "jenis_kelamin", width: 13, style },
        { key: "no_hp", width: 23, style },
        { key: "prodi", width: 26, style },
        { key: "fakultas", width: 27, style },
        {
          key: "pembekalan",
          width: 14,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "upacara",
          width: 11,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "kehadiran_dilokasi",
          width: 14,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "lrk",
          width: 6,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "integritas",
          width: 11,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "sosial_kemasyarakatan",
          width: 21,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "lpk",
          width: 6,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "ujian_akhir",
          width: 10,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "tugas",
          width: 9,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "uts",
          width: 7,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "uas",
          width: 7,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "nilai_akhir",
          width: 13,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
        {
          key: "nilai_huruf",
          width: 13,
          style: {
            ...style,
            alignment: { ...style.alignment, horizontal: "center" },
          },
        },
      ];

      let startRow = 8;
      list.forEach((item, i) => {
        let idRow = startRow + i;
        const row = worksheet.getRow(idRow);

        row.values = item;

        // tugas
        row.getCell(16).value = {
          formula: `((H${idRow}+I${idRow}+J${idRow}+L${idRow}+M${idRow})/5)`,
          result: item.tugas,
        };
        // uts
        row.getCell(17).value = {
          formula: `(K${idRow}+N${idRow})/2`,
          result: item.uts,
        };
        // uas
        row.getCell(18).value = {
          formula: `O${idRow}`,
          result: item.uas,
        };
        // nilai akhir
        row.getCell(19).value = {
          formula: `((P${idRow}*50%)+(Q${idRow}*25%)+(R${idRow}*25%))`,
          result: item.nilai_akhir,
        };
        // nilai huruf
        row.getCell(20).value = {
          formula: `IF(S${idRow}>=80, "A", IF(S${idRow}>=70, "B", IF(S${idRow}>=60,"C",IF(S${idRow}>=50, "D", "E"))))`,
          result: item.nilai_huruf,
        };

        for (let i = 1; i <= 20; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      await workbook.xlsx.writeFile(`resources/assets/exports/export.xlsx`);

      res.download(
        `resources/assets/exports/export.xlsx`,
        "export.xlsx",
        (error) => {
          if (error) {
            console.error("exportDataNilai module error ", error);

            return {
              status: false,
              error,
            };
          }
        }
      );
    } catch (error) {
      console.error("exportDataNilai module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _exportToExcel();
