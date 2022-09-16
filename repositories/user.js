const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (email) => await prisma.user.create({
    data: {
        email
    },
});

const deleteUser = async (id) => await prisma.user.delete({
    where: {
      id,
    },
});

module.exports = {
    createUser,
    getUsers,
    deleteUser
}
