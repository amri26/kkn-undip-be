const { prisma } = require("../helpers/database");
const Joi = require("joi");
const ExcelJS = require("exceljs");
const excelToJson = require("convert-excel-to-json");

class _nilai {
  listNilaiKecamatan = async (id_kecamatan) => {
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
        data: list,
      };
    } catch (error) {
      console.error("listNilaiKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getNilai = async (id_nilai) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_nilai);

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

      const nilai = await prisma.nilai.findUnique({
        where: {
          id_nilai,
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
        data: nilai,
      };
    } catch (error) {
      console.error("getNilai module error ", error);

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

  resetNlai = async (id_nilai) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_nilai);

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

      await prisma.nilai.update({
        where: {
          id_nilai,
        },
        data: {
          pembekalan: null,
          upacara: null,
          kehadiran_dilokasi: null,
          lrk: null,
          integritas: null,
          sosial_kemasyarakatan: null,
          lpk: null,
          ujian_akhir: null,
          tugas: null,
          uts: null,
          uas: null,
          nilai_akhir: null,
          nilai_huruf: null,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("resetNlai module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  downloadFormatImport = async (res, id_kecamatan) => {
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

      const list = await prisma.mahasiswa.findMany({
        where: {
          mahasiswa_kecamatan_active: {
            id_kecamatan,
          },
        },
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
      });

      list.forEach((mhs, i) => {
        mhs.no = i + 1;
        mhs.tema = mhs.mahasiswa_kecamatan_active.kecamatan.kabupaten.tema.nama;
        mhs.kabupaten = mhs.mahasiswa_kecamatan_active.kecamatan.kabupaten.nama;
        mhs.kecamatan = mhs.mahasiswa_kecamatan_active.kecamatan.nama;
        mhs.jenis_kelamin = mhs.jenis_kelamin == 1 ? "Laki-laki" : "Perempuan";
        mhs.fakultas = mhs.prodi.fakultas.nama;
        mhs.prodi = mhs.prodi.nama;

        delete mhs.mahasiswa_kecamatan_active;
      });

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        "resources/assets/templates/Template Impor Data Nilai.xlsx"
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
        };
        // uts
        row.getCell(17).value = {
          formula: `(K${idRow}+N${idRow})/2`,
        };
        // uas
        row.getCell(18).value = {
          formula: `O${idRow}`,
        };
        // nilai akhir
        row.getCell(19).value = {
          formula: `((P${idRow}*50%)+(Q${idRow}*25%)+(R${idRow}*25%))`,
        };
        // nilai huruf
        row.getCell(20).value = {
          formula: `IF(S${idRow}>=80, "A", IF(S${idRow}>=70, "B", IF(S${idRow}>=60,"C",IF(S${idRow}>=50, "D", "E"))))`,
        };

        for (let i = 1; i <= 20; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }

        for (let i = 16; i <= 20; i++) {
          row.getCell(i).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D0CECE" },
          };
        }
      });

      await workbook.xlsx.writeFile(`resources/assets/imports/import.xlsx`);

      res.download(
        `resources/assets/imports/import.xlsx`,
        "import.xlsx",
        (error) => {
          if (error) {
            console.error("downloadFormatImport module error ", error);

            return {
              status: false,
              error,
            };
          }
        }
      );
    } catch (error) {
      console.error("downloadFormatImport module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importNilai = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 7,
        },
        sheets: ["Sheet1"],
        columnToKey: {
          B: "nim",
          H: "pembekalan",
          I: "upacara",
          J: "kehadiran_dilokasi",
          K: "lrk",
          L: "integritas",
          M: "sosial_kemasyarakatan",
          N: "lpk",
          O: "ujian_akhir",
          P: "tugas",
          Q: "uts",
          R: "uas",
          S: "nilai_akhir",
          T: "nilai_huruf",
        },
      });

      result.Sheet1.forEach(async (nilai) => {
        const mhs = await prisma.mahasiswa.findUnique({
          where: {
            nim: nilai.nim,
          },
          select: {
            id_mahasiswa: true,
          },
        });

        await prisma.nilai.update({
          where: {
            id_mahasiswa: mhs.id_mahasiswa,
          },
          data: {
            pembekalan: nilai.pembekalan ?? 0,
            upacara: nilai.upacara ?? 0,
            kehadiran_dilokasi: nilai.kehadiran_dilokasi ?? 0,
            lrk: nilai.lrk ?? 0,
            integritas: nilai.integritas ?? 0,
            sosial_kemasyarakatan: nilai.sosial_kemasyarakatan ?? 0,
            lpk: nilai.lpk ?? 0,
            ujian_akhir: nilai.ujian_akhir ?? 0,
            tugas: nilai.tugas ? Math.round(nilai.tugas) : 0,
            uts: nilai.uts ? Math.round(nilai.uts) : 0,
            uas: nilai.uas ? Math.round(nilai.uas) : 0,
            nilai_akhir: nilai.nilai_akhir
              ? Number(Number(nilai.nilai_akhir).toFixed(2))
              : 0,
            nilai_huruf: nilai.nilai_huruf,
          },
        });
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("importNilai module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _nilai();
