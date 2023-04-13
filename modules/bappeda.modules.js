const { prisma, Prisma } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");

class _bappeda {
    listBappeda = async () => {
        try {
            const list = await prisma.bappeda.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listBappeda module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addBappeda = async (created_by, body) => {
        try {
            body = {
                created_by,
                ...body,
            };

            const schema = Joi.object({
                nama: Joi.string().required(),
                nisn: Joi.string().required(),
                kabupaten: Joi.string().required(),
                nama_pj: Joi.string().required(),
                created_by: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nisn,
                    password: bcrypt.hashSync(body.nisn, 10),
                    role: "BAPPEDA",
                },
                select: {
                    id_user: true,
                },
            });

            const addKabupaten = await prisma.kabupaten.create({
                data: {
                    nama: body.kabupaten,
                },
                select: {
                    id_kabupaten: true,
                },
            });

            await prisma.bappeda.create({
                data: {
                    id_user: addUser.id_user,
                    id_kabupaten: addKabupaten.id_kabupaten,
                    nama: body.nama,
                    nisn: body.nisn,
                    nama_pj: body.nama_pj,
                    created_by,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found",
                    };
                }
            }

            console.error("addBappeda module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _bappeda();
