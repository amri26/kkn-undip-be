const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");

class _admin {
    listAdmin = async () => {
        try {
            const list = await prisma.admin.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listAdmin module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listUser = async () => {
        try {
            const list = await prisma.user.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listUser module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listTema = async () => {
        try {
            const list = await prisma.tema.findMany();

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addTema = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                periode: Joi.string().required(),
                jenis: Joi.number().required(),
                kab: Joi.string().allow(null, ""),
                kec: Joi.string().allow(null, ""),
                desa: Joi.string().allow(null, ""),
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

            const add = await prisma.tema.create({
                data: {
                    nama: body.nama,
                    periode: body.periode,
                    jenis: body.jenis,
                    kab: body.kab,
                    kec: body.kec,
                    desa: body.desa,
                },
                select: {
                    id_tema: true,
                },
            });

            const list = await prisma.halaman.findMany();

            for (let i = 0; i < list.length; i++) {
                await prisma.tema_halaman.create({
                    data: {
                        id_tema: add.id_tema,
                        id_halaman: list[i].id_halaman,
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    editTema = async (id_tema, body) => {
        try {
            body = {
                id_tema,
                ...body,
            };

            const schema = Joi.object({
                id_tema: Joi.number().required(),
                nama: Joi.string().required(),
                periode: Joi.string().required(),
                kab: Joi.string().allow(null),
                kec: Joi.string().allow(null),
                desa: Joi.string().allow(null),
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

            const check = await prisma.tema.findUnique({
                where: {
                    id_tema,
                },
                select: {
                    status: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            await prisma.tema.update({
                where: {
                    id_tema,
                },
                data: {
                    nama: body.nama,
                    periode: body.periode,
                    kab: body.kab,
                    kec: body.kec,
                    desa: body.desa,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("editTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    switchTema = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const check = await prisma.tema.findUnique({
                where: {
                    id_tema,
                },
                select: {
                    status: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            await prisma.tema.update({
                where: {
                    id_tema,
                },
                data: {
                    status: !check.status,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("switchTema module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listHalaman = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const list = await prisma.tema_halaman.findMany({
                where: {
                    id_tema,
                },
                include: {
                    halaman: true,
                    tema: true,
                },
            });

            return {
                status: true,
                data: list,
            };
        } catch (error) {
            console.error("listHalaman module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addHalaman = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
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

            await prisma.halaman.create({
                data: {
                    nama: body.nama,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addHalaman module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    switchHalaman = async (id_tema_halaman) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema_halaman);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const check = await prisma.tema_halaman.findUnique({
                where: {
                    id_tema_halaman,
                },
                select: {
                    status: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            await prisma.tema_halaman.update({
                where: {
                    id_tema_halaman,
                },
                data: {
                    status: !check.status,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("switchHalaman module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    listGelombang = async (id_tema) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_tema);

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
                        id_tema,
                    },
                },
                include: {
                    tema_halaman: {
                        select: {
                            halaman: {
                                select: {
                                    nama: true,
                                },
                            },
                            tema: {
                                select: {
                                    nama: true,
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
            console.error("listGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    getGelombang = async (id_gelombang) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_gelombang);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const gelombang = await prisma.gelombang.findUnique({
                where: {
                    id_gelombang,
                },
            });

            return {
                status: true,
                data: gelombang,
            };
        } catch (error) {
            console.error("getGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addGelombang = async (body) => {
        try {
            const schema = Joi.object({
                id_tema_halaman: Joi.number().required(),
                nama: Joi.string().required(),
                tgl_mulai: Joi.date().allow(null),
                tgl_akhir: Joi.date().allow(null),
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

            await prisma.gelombang.create({
                data: {
                    id_tema_halaman: body.id_tema_halaman,
                    nama: body.nama,
                    tgl_mulai: body.tgl_mulai ?? null,
                    tgl_akhir: body.tgl_akhir ?? null,
                },
            });

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    editGelombang = async (id_gelombang, body) => {
        try {
            body = {
                id_gelombang,
                ...body,
            };

            const schema = Joi.object({
                id_gelombang: Joi.number().required(),
                id_tema_halaman: Joi.number().required(),
                nama: Joi.string().required(),
                tgl_mulai: Joi.date().allow(null),
                tgl_akhir: Joi.date().allow(null),
                status: Joi.number().required(),
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

            await prisma.gelombang.update({
                where: {
                    id_gelombang,
                },
                data: {
                    id_tema_halaman: body.id_tema_halaman,
                    nama: body.nama,
                    tgl_mulai: body.tgl_mulai ?? null,
                    tgl_akhir: body.tgl_akhir ?? null,
                    status: body.status ? true : false,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("editGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    switchGelombang = async (id_gelombang) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_gelombang);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const check = await prisma.gelombang.findUnique({
                where: {
                    id_gelombang,
                },
                select: {
                    status: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            await prisma.gelombang.update({
                where: {
                    id_gelombang,
                },
                data: {
                    status: !check.status,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("switchGelombang module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addMahasiswa = async (file) => {
        try {
            const result = excelToJson({
                source: file.buffer,
                header: {
                    rows: 1,
                },
                sheets: ["mahasiswa"],
                columnToKey: {
                    B: "nama",
                    C: "nim",
                },
            });

            for (let i = 0; i < result.mahasiswa.length; i++) {
                const e = result.mahasiswa[i];

                const checkUser = await prisma.user.findUnique({
                    where: {
                        username: String(e.nim),
                    },
                    select: {
                        username: true,
                    },
                });

                const checkMahasiswa = await prisma.mahasiswa.findUnique({
                    where: {
                        nim: String(e.nim),
                    },
                    select: {
                        nim: true,
                    },
                });

                if (checkUser) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIM " + checkUser.username,
                    };
                } else if (checkMahasiswa) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIM " + checkMahasiswa.nim,
                    };
                }

                const addUser = await prisma.user.create({
                    data: {
                        username: String(e.nim),
                        password: bcrypt.hashSync(String(e.nim), 10),
                        role: Role.MAHASISWA,
                    },
                    select: {
                        id_user: true,
                    },
                });

                await prisma.mahasiswa.create({
                    data: {
                        nama: e.nama,
                        nim: String(e.nim),
                        id_user: addUser.id_user,
                    },
                });
            }

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

    addMahasiswaSingle = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nim: Joi.string().required(),
                prodi: Joi.number().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nim,
                    password: bcrypt.hashSync(body.nim, 10),
                    role: Role.MAHASISWA,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.mahasiswa.create({
                data: {
                    nama: body.nama,
                    nim: body.nim,
                    id_user: addUser.id_user,
                    id_prodi: body.prodi,
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

            console.error("addMahasiswaSingle module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addDosen = async (file) => {
        try {
            const result = excelToJson({
                source: file.buffer,
                header: {
                    rows: 1,
                },
                sheets: ["dosen"],
                columnToKey: {
                    B: "nama",
                    C: "nip",
                },
            });

            for (let i = 0; i < result.dosen.length; i++) {
                const e = result.dosen[i];

                const checkUser = await prisma.user.findUnique({
                    where: {
                        username: String(e.nip),
                    },
                    select: {
                        username: true,
                    },
                });

                const checkDosen = await prisma.dosen.findUnique({
                    where: {
                        nip: String(e.nip),
                    },
                    select: {
                        nip: true,
                    },
                });

                if (checkUser) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIP " + checkUser.username,
                    };
                } else if (checkDosen) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIP " + checkDosen.nip,
                    };
                }

                const addUser = await prisma.user.create({
                    data: {
                        username: String(e.nip),
                        password: bcrypt.hashSync(String(e.nip), 10),
                        role: Role.DOSEN,
                    },
                    select: {
                        id_user: true,
                    },
                });

                await prisma.dosen.create({
                    data: {
                        id_user: addUser.id_user,
                        nama: e.nama,
                        nip: String(e.nip),
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addDosen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addDosenSingle = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nip: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nip,
                    password: bcrypt.hashSync(body.nip, 10),
                    role: Role.DOSEN,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.dosen.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nip: body.nip,
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

            console.error("addDosenSingle module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addKorwil = async (file) => {
        try {
            const result = excelToJson({
                source: file.buffer,
                header: {
                    rows: 1,
                },
                sheets: ["korwil"],
                columnToKey: {
                    B: "nama",
                    C: "nk",
                },
            });

            for (let i = 0; i < result.korwil.length; i++) {
                const e = result.korwil[i];

                const checkKorwil = await prisma.korwil.findUnique({
                    where: {
                        nk: String(e.nk),
                    },
                    select: {
                        nk: true,
                    },
                });

                if (checkKorwil) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NK " + checkKorwil.nk,
                    };
                }

                await prisma.korwil.create({
                    data: {
                        nama: e.nama,
                        nk: String(e.nk),
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addKorwil module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addKorwilSingle = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nk: Joi.string().required(),
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

            await prisma.korwil.create({
                data: {
                    nama: body.nama,
                    nk: body.nk,
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

            console.error("addKorwilSingle module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addBappeda = async (created_by, file) => {
        try {
            const schema = Joi.string().required();

            const validation = schema.validate(created_by);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const result = excelToJson({
                source: file.buffer,
                header: {
                    rows: 1,
                },
                sheets: ["bappeda"],
                columnToKey: {
                    B: "nama",
                    C: "nb",
                    D: "nama_kabupaten",
                    E: "nama_pj",
                },
            });

            for (let i = 0; i < result.bappeda.length; i++) {
                const e = result.bappeda[i];

                const checkUser = await prisma.user.findUnique({
                    where: {
                        username: String(e.nb),
                    },
                    select: {
                        username: true,
                    },
                });

                const checkBappeda = await prisma.bappeda.findUnique({
                    where: {
                        nb: String(e.nb),
                    },
                    select: {
                        nb: true,
                    },
                });

                if (checkUser) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NB " + checkUser.username,
                    };
                } else if (checkBappeda) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NB " + checkBappeda.nb,
                    };
                }

                const addUser = await prisma.user.create({
                    data: {
                        username: String(e.nb),
                        password: bcrypt.hashSync(String(e.nb), 10),
                        role: Role.BAPPEDA,
                    },
                    select: {
                        id_user: true,
                    },
                });

                await prisma.bappeda.create({
                    data: {
                        id_user: addUser.id_user,
                        nama: e.nama,
                        nb: String(e.nb),
                        nama_kabupaten: e.nama_kabupaten,
                        nama_pj: e.nama_pj,
                        created_by,
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addBappeda module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addBappedaSingle = async (created_by, body) => {
        try {
            body = {
                created_by,
                ...body,
            };

            const schema = Joi.object({
                nama: Joi.string().required(),
                nb: Joi.string().required(),
                nama_kabupaten: Joi.string().required(),
                nama_pj: Joi.string().required(),
                created_by: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nb,
                    password: bcrypt.hashSync(body.nb, 10),
                    role: Role.BAPPEDA,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.bappeda.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nb: body.nb,
                    nama_kabupaten: body.nama_kabupaten,
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

            console.error("addBappedaSingle module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addReviewer = async (file) => {
        try {
            const result = excelToJson({
                source: file.buffer,
                header: {
                    rows: 1,
                },
                sheets: ["reviewer"],
                columnToKey: {
                    B: "nama",
                    C: "nip",
                },
            });

            for (let i = 0; i < result.reviewer.length; i++) {
                const e = result.reviewer[i];

                const checkUser = await prisma.user.findUnique({
                    where: {
                        username: String(e.nip),
                    },
                    select: {
                        username: true,
                    },
                });

                const checkReviewer = await prisma.reviewer.findUnique({
                    where: {
                        nip: String(e.nip),
                    },
                    select: {
                        nip: true,
                    },
                });

                if (checkUser) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIP " + checkUser.username,
                    };
                } else if (checkReviewer) {
                    return {
                        status: false,
                        code: 409,
                        error: "Data duplicate found, NIP " + checkReviewer.nip,
                    };
                }

                const addUser = await prisma.user.create({
                    data: {
                        username: String(e.nip),
                        password: bcrypt.hashSync(String(e.nip), 10),
                        role: Role.REVIEWER,
                    },
                    select: {
                        id_user: true,
                    },
                });

                await prisma.reviewer.create({
                    data: {
                        id_user: addUser.id_user,
                        nama: e.nama,
                        nip: String(e.nip),
                    },
                });
            }

            return {
                status: true,
                code: 201,
            };
        } catch (error) {
            console.error("addReviewer module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    addReviewerSingle = async (body) => {
        try {
            const schema = Joi.object({
                nama: Joi.string().required(),
                nip: Joi.string().required(),
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

            const addUser = await prisma.user.create({
                data: {
                    username: body.nip,
                    password: bcrypt.hashSync(body.nip, 10),
                    role: Role.REVIEWER,
                },
                select: {
                    id_user: true,
                },
            });

            await prisma.reviewer.create({
                data: {
                    id_user: addUser.id_user,
                    nama: body.nama,
                    nip: body.nip,
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

            console.error("addReviewerSingle module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    accKecamatan = async (id_kecamatan, body) => {
        try {
            body = {
                id_kecamatan,
                ...body,
            };

            const schema = Joi.object({
                id_kecamatan: Joi.number().required(),
                id_korwil: Joi.number().required(),
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

            await prisma.kecamatan.update({
                where: {
                    id_kecamatan,
                },
                data: {
                    id_korwil: body.id_korwil,
                    status: 1,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("accKecamatan module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    decKecamatan = async (id_kecamatan) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_kecamatan);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            await prisma.kecamatan.update({
                where: {
                    id_kecamatan,
                },
                data: {
                    id_korwil: null,
                    status: -1,
                },
            });

            return {
                status: true,
                code: 204,
            };
        } catch (error) {
            console.error("decKecamatan module error ", error);

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
                const errorDetails = validation.error.details.map((detail) => detail.message);

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
                const errorDetails = validation.error.details.map((detail) => detail.message);

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
}

module.exports = new _admin();
