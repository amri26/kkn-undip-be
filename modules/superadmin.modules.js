const { prisma, Prisma, Role } = require("../helpers/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");

class _superadmin {}

module.exports = new _superadmin();
