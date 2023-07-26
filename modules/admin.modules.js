const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _admin {
  listAdmin = async () => {
    try {
      const list = await prisma.admin.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listAdmin module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getAdmin = async (id_admin) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_admin);

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

      const admin = await prisma.admin.findUnique({
        where: {
          id_admin,
        },
        select: {
          id_admin: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: admin,
      };
    } catch (error) {
      console.error("getAdmin module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReviewer = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["reviewer"],
        columnToKey: {
          B: "nama",
          C: "nip",
        },
      });

      for (let i = 0; i < result.reviewer.length; i++) {
        const e = result.reviewer[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nip),
          },
          select: {
            username: true,
          },
        });

        const checkReviewer = await prisma.reviewer.findUnique({
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
        } else if (checkReviewer) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkReviewer.nip,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nip),
            password: bcrypt.hashSync(String(e.nip), 10),
            role: Role.REVIEWER,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.reviewer.create({
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
      console.error("addReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addReviewerSingle = async (body) => {
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
          role: Role.REVIEWER,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.reviewer.create({
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

      console.error("addReviewerSingle module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editReviewer = async (id_reviewer, body) => {
    try {
      body = {
        id_reviewer,
        ...body,
      };

      const schema = Joi.object({
        id_reviewer: Joi.number().required(),
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

      const reviewer = await prisma.reviewer.findUnique({
        where: {
          id_reviewer: body.id_reviewer,
        },
      });

      if (!reviewer) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (reviewer.nip != body.nip) {
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
          username: reviewer.nip,
        },
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
        },
      });

      await prisma.reviewer.update({
        where: {
          id_reviewer: body.id_reviewer,
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

      console.error("editReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteReviewer = async (id_reviewer) => {
    try {
      const reviewer = await prisma.reviewer.delete({
        where: {
          id_reviewer,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: reviewer.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addPimpinan = async (file) => {
    try {
      const result = excelToJson({
        source: file.buffer,
        header: {
          rows: 1,
        },
        sheets: ["pimpinan"],
        columnToKey: {
          B: "nama",
          C: "nip",
        },
      });

      for (let i = 0; i < result.pimpinan.length; i++) {
        const e = result.pimpinan[i];

        const checkUser = await prisma.user.findUnique({
          where: {
            username: String(e.nip),
          },
          select: {
            username: true,
          },
        });

        const checkPimpinan = await prisma.pimpinan.findUnique({
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
        } else if (checkPimpinan) {
          return {
            status: false,
            code: 409,
            error: "Data duplicate found, NIP " + checkPimpinan.nip,
          };
        }

        const addUser = await prisma.user.create({
          data: {
            username: String(e.nip),
            password: bcrypt.hashSync(String(e.nip), 10),
            role: Role.PIMPINAN,
          },
          select: {
            id_user: true,
          },
        });

        await prisma.pimpinan.create({
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
      console.error("addPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addPimpinanSingle = async (body) => {
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
          role: Role.PIMPINAN,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.pimpinan.create({
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

      console.error("addPimpinanSingle module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editPimpinan = async (id_pimpinan, body) => {
    try {
      body = {
        id_pimpinan,
        ...body,
      };

      const schema = Joi.object({
        id_pimpinan: Joi.number().required(),
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

      const pimpinan = await prisma.pimpinan.findUnique({
        where: {
          id_pimpinan: body.id_pimpinan,
        },
      });

      if (!pimpinan) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      } else if (pimpinan.nip != body.nip) {
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
          username: pimpinan.nip,
        },
        data: {
          username: body.nip,
          password: bcrypt.hashSync(body.nip, 10),
        },
      });

      await prisma.pimpinan.update({
        where: {
          id_pimpinan: body.id_pimpinan,
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

      console.error("editPimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePimpinan = async (id_pimpinan) => {
    try {
      const pimpinan = await prisma.pimpinan.delete({
        where: {
          id_pimpinan,
        },
        select: {
          id_user: true,
        },
      });

      await prisma.user.delete({
        where: {
          id_user: pimpinan.id_user,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePimpinan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  accKecamatan = async (id_kecamatan, body) => {
    try {
      body = {
        id_kecamatan,
        ...body,
      };

      const schema = Joi.object({
        id_kecamatan: Joi.number().required(),
        id_korwil: Joi.number().required(),
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

      await prisma.kecamatan.update({
        where: {
          id_kecamatan,
        },
        data: {
          id_korwil: body.id_korwil,
          status: 1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("accKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteKecamatan = async (id_kecamatan) => {
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

      const check = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan,
        },
      });

      if (!check) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (check.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Kecamatan masih dalam status aktif!",
        };
      }

      await prisma.kecamatan.delete({
        where: {
          id_kecamatan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decKecamatan = async (id_kecamatan) => {
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

      await prisma.kecamatan.update({
        where: {
          id_kecamatan,
        },
        data: {
          id_korwil: null,
          status: -1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("decKecamatan module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  accProposal = async (id_proposal) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_proposal);

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

      await prisma.proposal.update({
        where: {
          id_proposal,
        },
        data: {
          status: 1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("accProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  decProposal = async (id_proposal) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_proposal);

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

      await prisma.proposal.update({
        where: {
          id_proposal,
        },
        data: {
          status: -1,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("decProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addEvent = async (body) => {
    try {
      const schema = Joi.object({
        judul: Joi.string().required(),
        keterangan: Joi.string().allow(null, ""),
        tgl_mulai: Joi.date().required(),
        tgl_akhir: Joi.date().required(),
        tempat: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.event.create({
        data: {
          judul: body.judul,
          keterangan: body.keterangan,
          tgl_mulai: body.tgl_mulai,
          tgl_akhir: body.tgl_akhir,
          tempat: body.tempat,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editEvent = async (id_event, body) => {
    try {
      body = {
        id_event,
        ...body,
      };

      const schema = Joi.object({
        id_event: Joi.number().required(),
        judul: Joi.string().required(),
        keterangan: Joi.string(),
        tgl_mulai: Joi.date().required(),
        tgl_akhir: Joi.date().required(),
        tempat: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.event.update({
        where: {
          id_event: body.id_event,
        },
        data: {
          judul: body.judul,
          keterangan: body.keterangan,
          tgl_mulai: body.tgl_mulai,
          tgl_akhir: body.tgl_akhir,
          tempat: body.tempat,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteEvent = async (id_event) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_event);

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

      await prisma.event.delete({
        where: {
          id_event,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteEvent module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addPengumuman = async (body) => {
    try {
      const schema = Joi.object({
        judul: Joi.string().required(),
        isi: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.pengumuman.create({
        data: {
          judul: body.judul,
          isi: body.isi,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  editPengumuman = async (id_pengumuman, body) => {
    try {
      body = {
        id_pengumuman,
        ...body,
      };

      const schema = Joi.object({
        id_pengumuman: Joi.number().required(),
        judul: Joi.string().required(),
        isi: Joi.string().required(),
        peruntukan: Joi.string().required(),
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

      await prisma.pengumuman.update({
        where: {
          id_pengumuman: body.id_pengumuman,
        },
        data: {
          judul: body.judul,
          isi: body.isi,
          peruntukan: body.peruntukan,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editPengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deletePengumuman = async (id_pengumuman) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_pengumuman);

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

      await prisma.pengumuman.delete({
        where: {
          id_pengumuman,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deletePengumuman module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _admin();
