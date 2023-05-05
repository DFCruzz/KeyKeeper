import { Prisma } from "@prisma/client";
import { prisma } from "@/config"

async function findByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
};

async function createUser(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
        data,
    });
};

const userRepository = {
    findByEmail,
    createUser
}

export default userRepository