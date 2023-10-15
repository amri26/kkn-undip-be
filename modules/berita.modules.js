const { prisma } = require("../helpers/database");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const moment = require("moment");

class _berita {
  async listBerita() {
    try {
      const list = await prisma.berita.findMany({
        include: {
          kategori: {
            select: {
              nama: true,
            },
          },
          user: {
            select: {
              dosen: {
                select: {
                  nama: true,
                },
              },
              pimpinan: {
                select: {
                  nama: true,
                },
              },
              reviewer: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      });

      list.map((berita) => {
        berita.kategori = berita.kategori.nama;
        berita.author =
          berita.user.dosen?.nama ??
          berita.user.pimpinan?.nama ??
          berita.user.reviewer?.nama ??
          "Administrator";
        delete berita.user;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listBerita module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async getBerita(id_berita) {
    try {
      const schema = Joi.number().required();

      const validation = schema.validate(id_berita);

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

      const berita = await prisma.berita.findUnique({
        where: {
          id_berita,
        },
      });

      return {
        status: true,
        data: berita,
      };
    } catch (error) {
      console.error("getBerita module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async addBerita(id_user, body, thumbnail) {
    try {
      const schema = Joi.object({
        judul: Joi.string().required(),
        body: Joi.string().required(),
        id_kategori: Joi.number().required(),
        id_user: Joi.number().required(),
      });

      body = {
        id_user,
        ...body,
      };

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (error) => error.message
        );

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          id_user,
        },
      });

      let pathFile = "";
      if (thumbnail) {
        const fileExtension = path
          .extname(thumbnail.originalname)
          .toLowerCase();
        pathFile = `resources/assets/images/thumbnail/${id_user}-${slugify(
          body.judul.toLowerCase()
        )}-${moment().format("YYYY-MM-DD")}${fileExtension}`;

        fs.writeFile(pathFile, thumbnail.buffer, (err) => {
          if (err) {
            return {
              status: false,
              error: err.message,
            };
          }
          console.log("The file was saved!");
        });
      }

      await prisma.berita.create({
        data: {
          judul: body.judul,
          body: body.body,
          id_author: user.id_user,
          id_kategori: parseInt(body.id_kategori),
          thumbnail: pathFile,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addBerita module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editBerita(id_user, id_berita, body, thumbnail) {
    try {
      body = {
        id_user,
        id_berita,
        ...body,
      };

      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_berita: Joi.number().required(),
        judul: Joi.string().required(),
        body: Joi.string().required(),
        id_kategori: Joi.number().required(),
      });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (error) => error.message
        );

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const berita = await prisma.berita.findUnique({
        where: {
          id_berita: body.id_berita,
        },
      });

      if (!berita) {
        return {
          status: false,
          code: 404,
          error: "Berita not found!",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          id_user,
        },
      });

      if (user.role !== "ADMIN" && berita.id_author != user.id_user) {
        return {
          status: false,
          code: 403,
          error: "Not authorized",
        };
      }

      if (thumbnail) {
        if (berita.thumbnail) {
          fs.unlinkSync(berita.thumbnail);
        }

        const fileExtension = path
          .extname(thumbnail.originalname)
          .toLowerCase();
        berita.thumbnail = `resources/assets/images/thumbnail/${id_user}-${slugify(
          body.judul.toLowerCase()
        )}-${moment().format("YYYY-MM-DD")}${fileExtension}`;

        fs.writeFile(berita.thumbnail, thumbnail.buffer, (err) => {
          if (err) {
            return {
              status: false,
              error: err.message,
            };
          }
        });
      }

      await prisma.berita.update({
        where: {
          id_berita: berita.id_berita,
        },
        data: {
          judul: body.judul,
          body: body.body,
          id_kategori: parseInt(body.id_kategori),
          thumbnail: berita.thumbnail,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editBerita module error", error);

      return {
        status: false,
        error,
      };
    }
  }

  async deleteBerita(id_user, id_berita) {
    try {
      const schema = Joi.object({
        id_user: Joi.number().required(),
        id_berita: Joi.number().required(),
      });

      const validation = schema.validate({ id_user, id_berita });

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (error) => error.message
        );

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const berita = await prisma.berita.findUnique({
        where: {
          id_berita,
        },
      });

      if (!berita)
        return { status: false, code: 404, error: "Berita not found!" };

      const user = await prisma.user.findUnique({
        where: {
          id_user,
        },
      });

      if (user.role !== "ADMIN" && user.id_user != berita.id_author)
        return { status: false, code: 403, error: "Not authorized" };

      await prisma.berita.delete({
        where: {
          id_berita,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteBerita module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _berita();
