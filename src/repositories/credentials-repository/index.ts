import { Prisma } from "@prisma/client";
import { prisma } from "@/config"
import { Credential } from "@prisma/client";

async function findById(id: number, userId: number) {
    return prisma.credential.findFirst({
        where: {
            id,
            userId
        }
    })
}

async function findByTitle(title: string, userId: number) {
    return prisma.credential.findFirst({
        where: {
            title,
            userId,
        }
    })
}

async function listAllByUserId(userId: number): Promise<Credential[]> {
    return prisma.credential.findMany({
        where: {
            userId,
        }
    })
}

async function createCredential(data: Prisma.CredentialUncheckedCreateInput) {
    return prisma.credential.create({
        data,
    })
}

async function deleteCredential(id: number) {
    return prisma.credential.delete({
        where: {
            id,
        }
    })
}

const credentialRepository = {
    findById,
    findByTitle,
    listAllByUserId,
    createCredential,
    deleteCredential
}

export default credentialRepository