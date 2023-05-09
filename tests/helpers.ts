import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';
import { createUser } from './factories/users-factory';

export async function cleanDb() {
    await prisma.user.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});

}

export async function generateValidToken(user?: User) {
    const incomingUser = user || (await createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

    await createSession(token);

    return token;
}