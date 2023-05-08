import Cryptr from "cryptr"
import credentialRepository from "@/repositories/credentials-repository"
import { Credential, Prisma } from "@prisma/client"
import { duplicatedTitleError, notFoundError, unauthorizedError } from "@/errors"

const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)

async function validateTitle(title: string, userId: number) {
    const isTitleValid = await credentialRepository.findByTitle(title, userId)
    
    if (isTitleValid) throw duplicatedTitleError()
}

async function createCredential({title, url, username, password, userId,}: CreateCredentialParams) {
    await validateTitle(title, userId)

    const encryptedPassword = cryptr.encrypt(password)

    return credentialRepository.createCredential({
        title,
        url,
        username,
        password: encryptedPassword,
        userId
    })
}

async function findCredential(id: number, userId: number) {
    const credential = await credentialRepository.findById(id, userId)

    if(!credential) throw notFoundError()

    credential.password = cryptr.decrypt(credential.password)
    return credential
}

async function listAllCredentials(userId: number) {
    const credentials = await credentialRepository.listAllByUserId(userId)

    if(!credentials || credentials.length === 0) throw notFoundError()

    credentials.map(credential => credential.password = cryptr.decrypt(credential.password))
    return credentials
}

async function deleteCredential(id: number, userId: number) {
    const credential = await credentialRepository.findById(id, userId)

    if(!credential) throw notFoundError()
    if(credential.userId !== userId) throw unauthorizedError()

    await credentialRepository.deleteCredential(id)
}

export type CreateCredentialParams = Omit<Credential, "id">

const credentialService = {
    createCredential,
    findCredential,
    listAllCredentials,
    deleteCredential
}

export default credentialService