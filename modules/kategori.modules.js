const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _kategori {
  async listKategori() {
    try {
      const list = await prisma.kategori.findMany({
        include: {
          _count: {
            select: {
              berita: true,
            },
          },
        },
      });

      list.map((kategori) => {
        kategori.jumlah_berita = kategori._count.berita;
        delete kategori._count;
      });

      return {
        status: true,
        data: list,
      };
    } catch (error) {
      console.error("listKategori module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async getKategori(id_kategori) {
    try {
      const schema = Joi.number().required();
      const { error } = schema.validate(id_kategori);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const kategori = await prisma.kategori.findUnique({
        where: {
          id_kategori,
        },
        include: {
          _count: {
            select: {
              berita: true,
            },
          },
        },
      });

      kategori.jumlah_berita = kategori._count.berita;
      delete kategori._count;

      return {
        status: true,
        data: kategori,
      };
    } catch (error) {
      console.error("getKategori module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async addKategori(body) {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
      });

      const { error } = schema.validate(body);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      await prisma.kategori.create({
        data: {
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 201,
      };
    } catch (error) {
      console.error("addKategori module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editKategori(id_kategori, body) {
    try {
      const schema = Joi.object({
        nama: Joi.string().required(),
        id_kategori: Joi.number().required(),
      });

      body = {
        id_kategori,
        ...body,
      };

      const { error } = schema.validate(body);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const kategori = await prisma.kategori.findUnique({
        where: {
          id_kategori,
        },
      });

      if (!kategori) {
        return {
          status: false,
          error: "Kategori not found!",
        };
      }

      await prisma.kategori.update({
        where: {
          id_kategori: kategori.id_kategori,
        },
        data: {
          nama: body.nama,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editKategori module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async deleteKategori(id_kategori) {
    try {
      const schema = Joi.number().required();
      const { error } = schema.validate(id_kategori);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          error: errorDetails.join(", "),
        };
      }

      const kategori = await prisma.kategori.findUnique({
        where: {
          id_kategori,
        },
      });

      if (!kategori) {
        return {
          status: false,
          error: "Kategori not found!",
        };
      }

      await prisma.kategori.delete({
        where: {
          id_kategori,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("deleteKategori module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _kategori();
