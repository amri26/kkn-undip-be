const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _mahasiswa {
    listMahasiswa = async (id_periode, id_prodi) => {
        try {
            const body = {
                id_periode,
                id_prodi,
            };

            const schema = Joi.object({
                id_periode: Joi.number().required(),
                id_prodi: Joi.string().required(),
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

            let list = {};

            if (body.id_prodi !== "all") {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_periode: body.id_periode,
                        id_prodi: body.id_prodi,
                    },
                });
            } else {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_periode: body.id_periode,
                    },
                });
            }

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

    daftarLokasi = async (id_user, body) => {
        try {
            body = {
                id_user,
                ...body,
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

            const checkMahasiswa = await prisma.mahasiswa.findFirst({
                where: {
                    id_user,
                },
                select: {
                    id_mahasiswa: true,
                    id_periode: true,
                },
            });

            if (!checkMahasiswa) {
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
                    id_periode: true,
                },
            });

            if (checkMahasiswa.id_periode !== checkKecamatan.id_periode) {
                return {
                    status: false,
                    code: 403,
                    error: "Forbidden",
                };
            }

            await prisma.mahasiswa_kecamatan.create({
                data: {
                    id_mahasiswa: checkMahasiswa.id_mahasiswa,
                    id_kecamatan: body.id_kecamatan,
                    status: 0,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("daftarLokasi module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _mahasiswa();
