import Cryptr from "cryptr"
import { Network } from "@prisma/client"
import { duplicatedTitleError, notFoundError, unauthorizedError } from "@/errors"
import networkRepository from "@/repositories/network-repository"

const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)

async function validateTitle(title: string, userId: number) {
    const isTitleValid = await networkRepository.findByTitle(title, userId)
    
    if (isTitleValid) throw duplicatedTitleError()
}

async function createNetwork({title, network, password, userId,}: CreateNetworkParams) {
    await validateTitle(title, userId)

    const encryptedPassword = cryptr.encrypt(password)

    return networkRepository.createNetwork({
        title,
        network,
        password: encryptedPassword,
        userId
    })
}

async function findNetwork(id: number, userId: number) {
    const network = await networkRepository.findById(id, userId)

    if(!network) throw notFoundError()

    network.password = cryptr.decrypt(network.password)
    return network
}

async function listAllNetworks(userId: number) {
    const networks = await networkRepository.listAllByUserId(userId)

    if(!networks || networks.length === 0) throw notFoundError()

    networks.map(network => network.password = cryptr.decrypt(network.password))
    return networks
}

async function deleteNetwork(id: number, userId: number) {
    const network = await networkRepository.findById(id, userId)

    if(!network) throw notFoundError()
    if(network.userId !== userId) throw unauthorizedError()

    await networkRepository.deleteNetwork(id)
}

export type CreateNetworkParams = Omit<Network, "id">

const networkService = {
    createNetwork,
    findNetwork,
    listAllNetworks,
    deleteNetwork
}

export default networkService