import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";
import { User, Credential } from "@prisma/client";
import Cryptr from "cryptr"
import { prisma } from "@/config";


const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)


export async function createCredential(user?: User): Promise<Credential> {
    const incomingUser = user || (await createUser());
    const encryptedPassword = cryptr.encrypt(faker.internet.password(10))
    
    return prisma.credential.create({
        data: {
          title: faker.lorem.sentence(),
          url: faker.internet.url(),
          username: faker.internet.userName(),
          password: encryptedPassword,
          userId: incomingUser.id,
        },
      });
}