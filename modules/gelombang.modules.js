const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _gelombang {
    listGelombang = async (id_tema, id_halaman) => {
        try {
            const body = {
                id_tema,
                id_halaman,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
                id_halaman: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.gelombang.findMany({
                where: {
                    tema_halaman: {
                        id_tema: body.id_tema,
                        id_halaman: body.id_halaman,
                    },
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listGelombangDosen = async (id_tema, id_halaman, id_dosen) => {
        try {
            const body = {
                id_tema,
                id_halaman,
                id_dosen,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
                id_halaman: Joi.number().required(),
                id_dosen: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.gelombang.findMany({
                where: {
                    tema_halaman: {
                        id_tema: body.id_tema,
                        id_halaman: body.id_halaman,
                    },
                },
                include: {
                    proposal: {
                        where: {
                            id_dosen: body.id_dosen,
                        },
                        include: {
                            kecamatan: {
                                select: {
                                    nama: true,
                                    kabupaten: {
                                        select: {
                                            bappeda: {
                                                select: {
                                                    nama_kabupaten: true,
                                                },
                                            },
                                        },
                                    },
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
            console.error("listGelombangDosen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listGelombangMahasiswa = async (id_tema, id_halaman, id_mahasiswa) => {
        try {
            const body = {
                id_tema,
                id_halaman,
                id_mahasiswa,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
                id_halaman: Joi.number().required(),
                id_mahasiswa: Joi.number().required(),
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.gelombang.findMany({
                where: {
                    tema_halaman: {
                        id_tema: body.id_tema,
                        id_halaman: body.id_halaman,
                    },
                },
                include: {
                    mahasiswa_kecamatan: {
                        where: {
                            id_mahasiswa: body.id_mahasiswa,
                        },
                        include: {
                            kecamatan: {
                                select: {
                                    nama: true,
                                    kabupaten: {
                                        select: {
                                            bappeda: {
                                                select: {
                                                    nama_kabupaten: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            list.forEach((item) => {
                item.jumlah_pendaftaran = item.mahasiswa_kecamatan.length;
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listGelombangMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _gelombang();
