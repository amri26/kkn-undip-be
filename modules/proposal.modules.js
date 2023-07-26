const { prisma } = require("../helpers/database");
const Joi = require("joi");
const { uploadDrive } = require("../helpers/upload");

class _proposal {
  listProposalTema = async (id_tema) => {
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

      const list = await prisma.proposal.findMany({
        where: {
          kecamatan: {
            kabupaten: {
              id_tema,
            },
          },
        },
        include: {
          dosen: true,
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  tema: {
                    select: {
                      periode: true,
                    },
                  },
                  nama: true,
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
      console.error("listProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listProposalDosen = async (id_user) => {
    try {
      const body = {
        id_user,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const list = await prisma.proposal.findMany({
        where: {
          id_dosen: checkDosen.id_dosen,
        },
        include: {
          dosen: true,
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  tema: {
                    select: {
                      periode: true,
                    },
                  },
                  nama: true,
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
      console.error("listProposalDosen module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  listProposalDosenTema = async (id_user, id_tema) => {
    try {
      const body = {
        id_user,
        id_tema,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_tema: Joi.number().required(),
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

      const list = await prisma.proposal.findMany({
        where: {
          kecamatan: {
            kabupaten: {
              id_tema,
            },
          },
          id_dosen: checkDosen.id_dosen,
        },
        include: {
          dosen: true,
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  tema: {
                    select: {
                      periode: true,
                    },
                  },
                  nama: true,
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
      console.error("listProposalDosenTema module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getProposal = async (id_proposal) => {
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

      const proposal = await prisma.proposal.findUnique({
        where: {
          id_proposal,
        },
        include: {
          dokumen: true,
          dosen: true,
          kecamatan: {
            select: {
              nama: true,
              kabupaten: {
                select: {
                  tema: {
                    select: {
                      periode: true,
                      nama: true,
                    },
                  },
                  nama: true,
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
        data: proposal,
      };
    } catch (error) {
      console.error("getProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  addProposal = async (file, id_user, body) => {
    try {
      delete body.id_tema;

      body = {
        id_user,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
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

      const checkDosen = await prisma.dosen.findUnique({
        where: {
          id_user,
        },
        select: {
          id_dosen: true,
        },
      });

      const checkKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id_kecamatan: Number(body.id_kecamatan),
        },
        select: {
          status: true,
        },
      });

      const checkGelombang = await prisma.gelombang.findUnique({
        where: {
          id_gelombang: Number(body.id_gelombang),
        },
        select: {
          status: true,
        },
      });

      const checkProposal = await prisma.proposal.findFirst({
        where: {
          id_dosen: checkDosen.id_dosen,
          id_kecamatan: Number(body.id_kecamatan),
        },
      });

      if (!checkDosen || !checkGelombang || !checkKecamatan) {
        return {
          status: false,
          code: 404,
          error: "Data tidak ditemukan",
        };
      } else if (!checkGelombang.status) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Gelombang tidak aktif",
        };
      } else if (checkKecamatan.status !== 1) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, Kecamatan belum disetujui",
        };
      } else if (checkProposal) {
        return {
          status: false,
          code: 403,
          error: "Forbidden, sudah terdaftar di Kecamatan ini",
        };
      }

      const fileDrive = await uploadDrive(
        file,
        "PROPOSAL",
        process.env.PROPOSAL_FOLDER_ID
      );

      const add = await prisma.dokumen.create({
        data: {
          id_drive: fileDrive.data.id,
        },
        select: {
          id_dokumen: true,
        },
      });

      await prisma.proposal.create({
        data: {
          id_dosen: checkDosen.id_dosen,
          id_kecamatan: Number(body.id_kecamatan),
          id_gelombang: Number(body.id_gelombang),
          id_dokumen: add.id_dokumen,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  deleteProposal = async (id_proposal) => {
    try {
      const schema = Joi.object({
        id_proposal: Joi.number().required(),
      });

      const validation = schema.validate({
        id_proposal,
      });

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

      const checkProposal = await prisma.proposal.findFirst({
        where: {
          id_proposal: Number(id_proposal),
        },
      });

      if (!checkProposal) {
        return {
          status: false,
          code: 404,
          error: "Data not found",
        };
      }

      if (checkProposal.status == 1) {
        return {
          status: false,
          code: 403,
          error: "Proposal sudah disetujui",
        };
      }

      await prisma.proposal.delete({
        where: {
          id_proposal,
        },
      });

      await prisma.dokumen.delete({
        where: {
          id_dokumen: checkProposal.id_dokumen,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteProposal module error ", error);

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

  evaluateProposal = async (body) => {
    try {
      const schema = Joi.object({
        id_proposal: Joi.number().required(),
        komentar: Joi.string(),
        rekomendasi: Joi.bool(),
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

      await prisma.proposal.update({
        where: {
          id_proposal: body.id_proposal,
        },
        data: {
          komentar: body.komentar,
          rekomendasi: body.rekomendasi,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("evaluateProposal module error ", error);

      return {
        status: false,
        error,
      };
    }
  };
}

module.exports = new _proposal();
