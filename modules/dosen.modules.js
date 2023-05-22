const { prisma } = require("../helpers/database");
const { uploadDrive } = require("../helpers/upload");
const Joi = require("joi");

require("dotenv").config();

class _dosen {
    listDosen = async () => {
        try {
            const list = await prisma.dosen.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listDosen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listMahasiswa = async (id_user, id_kecamatan) => {
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
                    mahasiswa: true,
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

    addProposal = async (file, id_user, body) => {
        try {
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

            const checkDosen = await prisma.dosen.findFirst({
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

            if (!checkDosen || !checkGelombang || !checkKecamatan) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            } else if (!checkGelombang.status) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Gelombang data is not activated",
                };
            } else if (checkKecamatan.status !== 1) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden, Kecamatan data is not approved",
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

    accMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_kecamatan,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_kecamatan: Joi.number().required(),
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

            const checkMahasiswaKecamatan =
                await prisma.mahasiswa_kecamatan.findUnique({
                    where: {
                        id_mahasiswa_kecamatan,
                    },
                    select: {
                        id_kecamatan: true,
                    },
                });

            if (!checkMahasiswaKecamatan) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
                },
                select: {
                    proposal: {
                        where: {
                            status: 1,
                        },
                        select: {
                            id_dosen: true,
                        },
                    },
                },
            });

            if (!checkKecamatan) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            } else if (
                !checkKecamatan.proposal.some(
                    (i) => i.id_dosen === checkDosen.id_dosen
                )
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_kecamatan.update({
                where: {
                    id_mahasiswa_kecamatan,
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
            console.error("accMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decMahasiswa = async (id_user, id_mahasiswa_kecamatan) => {
        try {
            const body = {
                id_user,
                id_mahasiswa_kecamatan,
            };

            const schema = Joi.object({
                id_user: Joi.number().required(),
                id_mahasiswa_kecamatan: Joi.number().required(),
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

            const checkMahasiswaKecamatan =
                await prisma.mahasiswa_kecamatan.findUnique({
                    where: {
                        id_mahasiswa_kecamatan,
                    },
                    select: {
                        id_kecamatan: true,
                    },
                });

            const checkKecamatan = await prisma.kecamatan.findUnique({
                where: {
                    id_kecamatan: checkMahasiswaKecamatan.id_kecamatan,
                },
                select: {
                    proposal: {
                        where: {
                            status: 1,
                        },
                        select: {
                            id_dosen: true,
                        },
                    },
                },
            });

            if (
                !checkKecamatan.proposal.some(
                    (i) => i.id_dosen === checkDosen.id_dosen
                )
            ) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_kecamatan.update({
                where: {
                    id_mahasiswa_kecamatan,
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
            console.error("decMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _dosen();
