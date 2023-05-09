import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";
import { User, Network } from "@prisma/client";
import Cryptr from "cryptr"
import { prisma } from "@/config";


const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)


export async function createNetwork(user?: User): Promise<Network> {
    const incomingUser = user || (await createUser());
    const encryptedPassword = cryptr.encrypt(faker.internet.password(10))
    
    return prisma.network.create({
        data: {
          title: faker.lorem.words(),
          network: faker.lorem.word(),
          password: encryptedPassword,
          userId: incomingUser.id,
        },
      });
}