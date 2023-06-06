const { prisma } = require("../helpers/database");
const { downloadDrive, embedLinkDrive } = require("../helpers/upload");
const Joi = require("joi");

class _dokumen {
    getDokumen = async (id_dokumen) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_dokumen);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const check = await prisma.dokumen.findUnique({
                where: {
                    id_dokumen,
                },
                select: {
                    id_drive: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const get = await downloadDrive(check.id_drive);

            return {
                status: true,
                data: get.data.webContentLink,
            };
        } catch (error) {
            console.error("getDokumen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };

    getEmbedLink = async (id_dokumen) => {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id_dokumen);

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const check = await prisma.dokumen.findUnique({
                where: {
                    id_dokumen,
                },
                select: {
                    id_drive: true,
                },
            });

            if (!check) {
                return {
                    status: false,
                    code: 404,
                    error: "Data not found",
                };
            }

            const get = await embedLinkDrive(check.id_drive);

            return {
                status: true,
                data: get.data.embedLink,
            };
        } catch (error) {
            console.error("getDokumen module error ", error);

            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _dokumen();
