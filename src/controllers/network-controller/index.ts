import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import credentialService from "@/services/credentials-service";
import httpStatus from "http-status";
import networkService from "@/services/network-service";

async function listNetworks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req

    try {
        const networks = await networkService.listAllNetworks(userId)
        return res.status(httpStatus.OK).send(networks)

    } catch (error) {
        next(error)
    }
}

async function getNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const id = Number(req.params.id)

    try {
        const network = await networkService.findNetwork(id, userId)
        return res.status(httpStatus.OK).send(network)

    } catch (error) {
        next(error)
    }
}

async function postNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const { title, network, password } = req.body

    try {
        const newNetwork = await networkService.createNetwork({title, network, password, userId})
        return res.status(httpStatus.CREATED).json({
            id: newNetwork.id
        })

    } catch (error) {
        next(error)
    }
}

async function deleteNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const id = Number(req.params.id)

    try {
        const network = await credentialService.deleteCredential(id, userId)
        return res.sendStatus(httpStatus.OK)

    } catch (error) {
        next(error)
    }
}

const networkController = {
    listNetworks,
    getNetwork,
    postNetwork,
    deleteNetwork
}

export default networkController