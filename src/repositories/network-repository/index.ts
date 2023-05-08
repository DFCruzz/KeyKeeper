import { Prisma } from "@prisma/client";
import { prisma } from "@/config"
import { Network } from "@prisma/client";

async function findById(id: number, userId: number) {
    return prisma.network.findFirst({
        where: {
            id,
            userId
        }
    })
}

async function findByTitle(title: string, userId: number) {
    return prisma.network.findFirst({
        where: {
            title,
            userId,
        }
    })
}

async function listAllByUserId(userId: number): Promise<Network[]> {
    return prisma.network.findMany({
        where: {
            userId,
        }
    })
}

async function createNetwork(data: Prisma.NetworkUncheckedCreateInput) {
    return prisma.network.create({
        data,
    })
}

async function deleteNetwork(id: number) {
    return prisma.network.delete({
        where: {
            id,
        }
    })
}

const networkRepository = {
    findById,
    findByTitle,
    listAllByUserId,
    createNetwork,
    deleteNetwork
}

export default networkRepository