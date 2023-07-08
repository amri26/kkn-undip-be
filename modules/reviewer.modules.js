const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _reviewer {
  listReviewer = async () => {
    try {
      const list = await prisma.reviewer.findMany();

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listReviewer module error ", error);

      return {
        status: false,
        error,
      };
    }
  };

  getReviewer = async (id_reviewer) => {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_reviewer);

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
          id_reviewer,
        },
        select: {
          id_reviewer: true,
          nama: true,
          nip: true,
        },
      });

      return {
        status: true,
        data: reviewer,
      };
    } catch (error) {
      console.error("getReviewer module error ", error);

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

module.exports = new _reviewer();
