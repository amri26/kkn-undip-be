const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _proposal {
    listProposal = async (body) => {
        try {
            const schema = Joi.object({
                id_periode: Joi.number().required(),
                id_kabupaten: Joi.number().required(),
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

            const list = await prisma.potensi.findMany({
                where: {
                    id_periode: body.id_periode,
                    kecamatan: {
                        id_kabupaten: body.id_kabupaten,
                    },
                },
                include: {
                    kecamatan: {
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

    addProposal = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_kecamatan: Joi.number().required(),
                proposal: Joi.string().required(),
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

            const checkDosen = await prisma.dosen.findFirst({
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

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: body.id_kecamatan,
                },
                select: {
                    status: true,
                },
            });

            if (checkKecamatan.status !== 1) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.proposal.create({
                data: {
                    id_dosen: checkDosen.id_dosen,
                    id_kecamatan: body.id_kecamatan,
                    proposal: body.proposal,
                    status: 0,
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

    accProposalReviewer = async (id_proposal) => {
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

            const check = await prisma.proposal.findUnique({
                where: {
                    id_proposal,
                },
                select: {
                    status: true,
                },
            });

            if (check.status === 2 || check.status === -2) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
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
            console.error("accProposalReviewer module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decProposalReviewer = async (id_proposal) => {
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

            const check = await prisma.proposal.findUnique({
                where: {
                    id_proposal,
                },
                select: {
                    status: true,
                },
            });

            if (check.status === 2 || check.status === -2) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
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
            console.error("decProposalReviewer module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accProposalAdmin = async (id_proposal) => {
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

            const check = await prisma.proposal.findUnique({
                where: {
                    id_proposal,
                },
                select: {
                    status: true,
                },
            });

            if (check.status === -1 || check.status === 0) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.proposal.update({
                where: {
                    id_proposal,
                },
                data: {
                    status: 2,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("accProposalAdmin module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decProposalAdmin = async (id_proposal) => {
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

            const check = await prisma.proposal.findUnique({
                where: {
                    id_proposal,
                },
                select: {
                    status: true,
                },
            });

            if (check.status === -1 || check.status === 0) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.proposal.update({
                where: {
                    id_proposal,
                },
                data: {
                    status: -2,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("decProposalAdmin module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _proposal();
