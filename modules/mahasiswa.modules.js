const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");
const ExcelJS = require("exceljs");
const { uploadDrive, deleteDrive } = require("../helpers/upload");

class _mahasiswa {
  listMahasiswa = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        include: {
          mahasiswa_kecamatan: {
            select: {
              gelombang: {
                select: {
                  nama: true,
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
          },
          mahasiswa_kecamatan_active: {
            select: {
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
          },
          prodi: {
            select: {
              nama: true,
              fakultas: {
                select: {
                  nama: true,
                  singkatan: true,
                },
              },
            },
          },
        },
      });

      list.forEach((mhs) => {
        mhs.lokasi = "Belum mendaftar";
        mhs.gelombang = "Belum mendaftar";
        if (mhs.status == 1) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mahasiswa_kecamatan?.kecamatan?.nama}, ${mahasiswa_kecamatan?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        } else if (mhs.status === 2) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mhs.mahasiswa_kecamatan_active?.kecamatan?.nama}, ${mhs.mahasiswa_kecamatan_active?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        }

        delete mhs.mahasiswa_kecamatan;
        delete mhs.mahasiswa_kecamatan_active;
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

  listMahasiswaTema = async (id_tema) => {
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

      const list = await prisma.mahasiswa.findMany({
        where: {
          mahasiswa_kecamatan: {
            some: {
              status: 1,
              kecamatan: {
                kabupaten: {
                  tema: {
                    id_tema,
                  },
                },
              },
            },
          },
        },
        include: {
          mahasiswa_kecamatan: {
            select: {
              gelombang: {
                select: {
                  nama: true,
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
          },
          mahasiswa_kecamatan_active: {
            select: {
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
          },
          prodi: {
            select: {
              nama: true,
              fakultas: {
                select: {
                  nama: true,
                  singkatan: true,
                },
              },
            },
          },
        },
      });

      list.forEach((mhs) => {
        mhs.lokasi = "Belum mendaftar";
        mhs.gelombang = "Belum mendaftar";
        if (mhs.status == 1) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mahasiswa_kecamatan?.kecamatan?.nama}, ${mahasiswa_kecamatan?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        } else if (mhs.status === 2) {
          let mahasiswa_kecamatan =
            mhs.mahasiswa_kecamatan[mhs.mahasiswa_kecamatan.length - 1];

          mhs.lokasi = `${mhs.mahasiswa_kecamatan_active?.kecamatan?.nama}, ${mhs.mahasiswa_kecamatan_active?.kecamatan?.kabupaten?.nama}`;
          mhs.gelombang = mahasiswa_kecamatan?.gelombang?.nama;
        }

        delete mhs.mahasiswa_kecamatan;
        delete mhs.mahasiswa_kecamatan_active;
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

  listMahasiswaUnregistered = async () => {
    try {
      const list = await prisma.mahasiswa.findMany({
        where: {
          status: 0,
        },
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
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
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
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
        include: {
          mahasiswa_kecamatan: {
            include: {
              gelombang: true,
              kecamatan: {
                select: {
                  kabupaten: {
                    select: {
                      nama: true,
                    },
                  },
                  nama: true,
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
          gelombang: true,
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
          kecamatan: true,
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

  listMahasiswaDosen = async (id_user, id_kecamatan) => {
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

  getMahasiswa = async (id_mahasiswa) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_mahasiswa);

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

      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa,
        },
        select: {
          id_mahasiswa: true,
          id_prodi: true,
          nama: true,
          nim: true,
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

      mahasiswa.id_fakultas = mahasiswa.prodi.fakultas.id_fakultas;
      delete mahasiswa.prodi;

      return {
        status: true,
        data: mahasiswa,
      };
    } catch (error) {
      console.error("getMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  importMahasiswa = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["Sheet1"],
        columnToKey: {
          B: "nama",
          C: "nim",
          D: "prodi",
        },
      });

      const prodis = await prisma.prodi.findMany({
        select: {
          id_prodi: true,
          nama: true,
        },
      });

      for (let i = 0; i < result.Sheet1.length; i++) {
        const e = result.Sheet1[i];

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

        const prodiMhs = prodis.find((p) => p.nama === e.prodi);

        await prisma.mahasiswa.create({
          data: {
            nama: e.nama,
            nim: String(e.nim),
            id_user: addUser.id_user,
            id_prodi: prodiMhs.id_prodi,
          },
        });
      }

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("importMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addMahasiswa = async (body) => {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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
          username: body.nim,
          password: bcrypt.hashSync(body.nim, 10),
          role: Role.MAHASISWA,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.mahasiswa.create({
        data: {
          nama: body.nama,
          nim: body.nim,
          id_user: addUser.id_user,
          id_prodi: body.prodi,
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

      console.error("addMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editMahasiswa = async (id_mahasiswa, body) => {
    try {
      body = {
        id_mahasiswa,
        ...body,
      };

      const schema = Joi.object({
        id_mahasiswa: Joi.number().required(),
        nama: Joi.string().required(),
        nim: Joi.string().required(),
        prodi: Joi.number().required(),
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

      const mhs = await prisma.mahasiswa.findUnique({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
      });

      if (!mhs) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (mhs.nim != body.nim) {
        const checkUser = await prisma.user.findUnique({
          where: {
            username: body.nim,
          },
          select: {
            username: true,
          },
        });

        if (checkUser) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIM sudah terdaftar",
          };
        }
      }

      await prisma.user.update({
        where: {
          username: mhs.nim,
        },
        data: {
          username: body.nim,
          password: bcrypt.hashSync(body.nim, 10),
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: body.id_mahasiswa,
        },
        data: {
          nama: body.nama,
          nim: body.nim,
          id_prodi: body.prodi,
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

      console.error("editMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteMahasiswa = async (id_mahasiswa) => {
    try {
      const checkMahasiswaRegistered =
        await prisma.mahasiswa_kecamatan_active.findFirst({
          where: {
            id_mahasiswa,
          },
        });

      if (checkMahasiswaRegistered) {
        return {
          status: false,
          code: 403,
          error: "Mahasiswa masih terdaftar di tema KKN",
        };
      }

      const mahasiswa = await prisma.mahasiswa.delete({
        where: {
          id_mahasiswa,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: mahasiswa.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteMahasiswa module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  downloadFormatImport = async (res) => {
    try {
      const prodis = await prisma.prodi.findMany({
        select: {
          nama: true,
        },
      });

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        "resources/assets/templates/Template Impor Data Mahasiswa.xlsx"
      );

      const worksheet = workbook.worksheets[0];

      let startRow = 3;
      prodis.forEach((prodi, i) => {
        let idRow = startRow + i;
        const row = worksheet.getRow(idRow);

        row.getCell("F").value = prodi.nama;
      });

      for (let i = 2; i <= 1000; i++) {
        const row = worksheet.getRow(i);

        row.getCell("D").dataValidation = {
          type: "list",
          allowBlank: false,
          formulae: ["$F$3:$F$" + (prodis.length + 2)],
          showInputMessage: true,
          promptTitle: "Pilih Prodi",
          prompt: "Pilih salah satu prodi",
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "Data tidak valid",
          error: "Pilih salah satu prodi yang telah disediakan!",
        };
      }

      await workbook.xlsx.writeFile("resources/assets/imports/import.xlsx");

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

  addKHS = async (file, id_user) => {
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

      const user = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
      });

      if (!user) {
        return {
          status: false,
          code: 404,
          error: "Data mahasiswa not found!",
        };
      }

      if (user.khs != null) {
        const dokumen = await prisma.dokumen.findUnique({
          where: {
            id_dokumen: parseInt(user.khs),
          },
        });

        if (dokumen) {
          await deleteDrive(dokumen.id_drive);

          await prisma.dokumen.delete({
            where: {
              id_dokumen: parseInt(dokumen.id_dokumen),
            },
          });
        }
      }

      const fileDrive = await uploadDrive(
        file,
        `KHS_${user.nim}_${user.nama}`,
        process.env.KHS_FOLDER_ID
      );

      const add = await prisma.dokumen.create({
        data: {
          id_drive: fileDrive.data.id,
        },
        select: {
          id_dokumen: true,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: parseInt(user.id_mahasiswa),
        },
        data: {
          khs: add.id_dokumen,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKHS module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addSuratPernyataan = async (file, id_user) => {
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

      const user = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
      });

      if (!user) {
        return {
          status: false,
          code: 404,
          error: "Data mahasiswa not found!",
        };
      }

      if (user.surat_pernyataan != null) {
        const dokumen = await prisma.dokumen.findUnique({
          where: {
            id_dokumen: parseInt(user.surat_pernyataan),
          },
        });

        if (dokumen) {
          await deleteDrive(dokumen.id_drive);

          await prisma.dokumen.delete({
            where: {
              id_dokumen: parseInt(dokumen.id_dokumen),
            },
          });
        }
      }

      const fileDrive = await uploadDrive(
        file,
        `Surat Pernyataan_${user.nim}_${user.nama}`,
        process.env.SURAT_PERNYATAAN_FOLDER_ID
      );

      const add = await prisma.dokumen.create({
        data: {
          id_drive: fileDrive.data.id,
        },
        select: {
          id_dokumen: true,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: parseInt(user.id_mahasiswa),
        },
        data: {
          surat_pernyataan: add.id_dokumen,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addSuratPernyataan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addFoto = async (file, id_user) => {
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

      const user = await prisma.mahasiswa.findUnique({
        where: {
          id_user,
        },
      });

      if (!user) {
        return {
          status: false,
          code: 404,
          error: "Data mahasiswa not found!",
        };
      }

      if (user.foto_profile != null) {
        const dokumen = await prisma.dokumen.findUnique({
          where: {
            id_dokumen: parseInt(user.foto_profile),
          },
        });

        if (dokumen) {
          await deleteDrive(dokumen.id_drive);

          await prisma.dokumen.delete({
            where: {
              id_dokumen: parseInt(dokumen.id_dokumen),
            },
          });
        }
      }

      const fileDrive = await uploadDrive(
        file,
        `Foto_${user.nim}_${user.nama}`,
        process.env.FOTO_FOLDER_ID
      );

      const add = await prisma.dokumen.create({
        data: {
          id_drive: fileDrive.data.id,
        },
        select: {
          id_dokumen: true,
        },
      });

      await prisma.mahasiswa.update({
        where: {
          id_mahasiswa: parseInt(user.id_mahasiswa),
        },
        data: {
          foto_profile: add.id_dokumen,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addFoto module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _mahasiswa();
