const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (email) => await prisma.user.create({
    data: {
        email
    },
});

const getUsers = async () => await prisma.user.findMany();

module.exports = {
    createUser,
    getUsers
}