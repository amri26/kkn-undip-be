const { prisma } = require("../helpers/database");
const Joi = require("joi");
const ExcelJS = require("exceljs");

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

        item.prodi = item.mahasiswa.prodi.nama;
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

      const tema = list[0].tema.replace(/\//g, "-");

      const nameFile = `Data Peserta Kec. ${list[0].kecamatan}, Kab. ${list[0].kabupaten} - ${tema}.xlsx`;

      await workbook.xlsx.writeFile(`resources/assets/exports/${nameFile}`);

      res.download(
        `resources/assets/exports/${nameFile}`,
        `${nameFile}`,
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

      // return {
      //   status: true,
      // };
    } catch (error) {
      console.error("exportDataPendaftaranMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _exportToExcel();
