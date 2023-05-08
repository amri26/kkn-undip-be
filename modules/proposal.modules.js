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
                    status: true,
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
                    status: false,
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
}

module.exports = new _proposal();
