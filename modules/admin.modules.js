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
