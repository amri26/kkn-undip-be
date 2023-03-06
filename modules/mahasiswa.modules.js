const prisma = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");

class _mahasiswa {
    listMahasiswa = async (id_periode, jurusan) => {
        try {
            const body = {
                id_periode,
                jurusan,
            };

            const schema = Joi.object({
                id_periode: Joi.number().required(),
                jurusan: Joi.string().required(),
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

            if (body.jurusan !== "all") {
                list = await prisma.mahasiswa.findMany({
                    where: {
                        id_periode: body.id_periode,
                        jurusan: body.jurusan,
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

    addMahasiswa = async (body) => {
        try {
            const schema = Joi.object({
                id_periode: Joi.number().required(),
                nama: Joi.string().required(),
                nim: Joi.string().required(),
                jurusan: Joi.string().required(),
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

            const check = await prisma.user.findUnique({
                where: {
                    username: body.nim,
                },
                select: {
                    id_user: true,
                },
            });

            if (check) {
                return {
                    status: false,
                    code: 409,
                    error: "Data duplicate found",
                };
            }

            const addUser = await prisma.user.create({
                data: {
                    username: body.nim,
                    password: bcrypt.hashSync(body.nim, 10),
                    tipe: 1,
                },
            });

            await prisma.mahasiswa.create({
                data: {
                    nama: body.nama,
                    nim: body.nim,
                    jurusan: body.jurusan,
                    id_user: addUser.id_user,
                    id_periode: body.id_periode,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addMahasiswa module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _mahasiswa();
