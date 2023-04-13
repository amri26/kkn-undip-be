const { PrismaClient, Prisma, Role } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = { prisma, Prisma, Role };
