import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import credentialService from "@/services/credentials-service";
import httpStatus from "http-status";

async function listCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req

    try {
        const credentials = await credentialService.listAllCredentials(userId)
        return res.status(httpStatus.OK).send(credentials)

    } catch (error) {
        next(error)
    }
}

async function getCredential(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const id = Number(req.params.id)

    try {
        const credential = await credentialService.findCredential(id, userId)
        return res.status(httpStatus.OK).send(credential)

    } catch (error) {
        next(error)
    }
}

async function postCredential(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const { title, url, username, password } = req.body

    try {
        const newCredential = await credentialService.createCredential({title, url, username, password, userId})
        return res.status(httpStatus.CREATED).json({
            id: newCredential.id
        })

    } catch (error) {
        next(error)
    }
}

async function deleteCredential(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    const id = Number(req.params.id)

    try {
        const credential = await credentialService.deleteCredential(id, userId)
        return res.sendStatus(httpStatus.OK)

    } catch (error) {
        next(error)
    }
}

const credentialController = {
    listCredentials,
    getCredential,
    postCredential,
    deleteCredential
}

export default credentialController