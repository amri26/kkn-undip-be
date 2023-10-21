const { prisma } = require("../helpers/database");
const Joi = require("joi");

class _profile {
  async getProfile() {
    try {
      const profile = await prisma.p2kkn_profile.findFirst();

      if (!profile) {
        return {
          status: false,
          code: 404,
          data: "Profile not found!",
        };
      }

      return {
        status: true,
        data: profile,
      };
    } catch (error) {
      console.error("getProfle module error ", error);

      return {
        status: false,
        error,
      };
    }
  }

  async editProfile(body) {
    try {
      const schema = Joi.object({
        profile: Joi.string().required(),
        visi: Joi.string().required(),
        misi: Joi.string().required(),
        alamat: Joi.string().required(),
        no_hp: Joi.string().allow("", null),
        email: Joi.string().email().required(),
        facebook: Joi.string().required(),
        twitter: Joi.string().required(),
        instagram: Joi.string().required(),
        youtube: Joi.string().required(),
      });

      const { error } = schema.validate(body);

      if (error) {
        const errorDetails = error.details.map((err) => err.message);

        return {
          status: false,
          code: 403,
          data: errorDetails.join(", "),
        };
      }

      const profile = await prisma.p2kkn_profile.findFirst();

      if (!profile) {
        return {
          status: false,
          code: 404,
          data: "Profile not found!",
        };
      }

      const updateProfile = await prisma.p2kkn_profile.update({
        where: {
          id_profile: profile.id_profile,
        },
        data: {
          profile: body.profile,
          visi: body.visi,
          misi: body.misi,
          alamat: body.alamat,
          no_hp: body.no_hp,
          email: body.email,
          facebook: body.facebook,
          twitter: body.twitter,
          instagram: body.instagram,
          youtube: body.youtube,
        },
      });

      return {
        status: true,
        code: 204,
      };
    } catch (error) {
      console.error("editProfile module error ", error);

      return {
        status: false,
        error,
      };
    }
  }
}

module.exports = new _profile();
