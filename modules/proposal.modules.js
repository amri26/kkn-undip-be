const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _proposal {
  listProposal = async (id_tema) => {
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
}

module.exports = new _proposal();
