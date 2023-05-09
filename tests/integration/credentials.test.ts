import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/users-factory";
import * as jwt from "jsonwebtoken"
import { createCredential } from "../factories/credentials-factory";
import Cryptr from "cryptr"

const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('GET /credentials', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/credentials');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it('should respond with status 404 if user has no credentials', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if credential is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const credential = await createCredential(user2);

            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and the user credential', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const credential = await createCredential(user);

            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual({
                id: credential.id,
                title: credential.title,
                url:credential.url,
                username: credential.username,
                password: cryptr.decrypt(credential.password),
                userId: credential.userId
            });
        });
    });
});

describe('POST /credentials', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/credentials');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });Credential

    describe('when token is valid', () => {
        it('should respond with status 400 if body is not found', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 if body is invalid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const body = { notCredential: 'string' };

            const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe('When body is valid', () => {
            const generateValidBody = () => ({
                title: faker.lorem.words(),
                url: faker.internet.url(),
                username: faker.internet.userName(),
                password: faker.internet.password(10),
            });

            it('should respond with status 409 if credential title already exists', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const credential = generateValidBody();

                const credential2 = await createCredential(user);

                credential.title = credential2.title;

                const response = await server.post(`/credentials`).send(credential).set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(httpStatus.CONFLICT);
            });

            it('should respond with status 201 and credential id', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const credential = generateValidBody();

                const response = await server.post(`/credentials`).send(credential).set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(httpStatus.CREATED);
                expect(response.body).toEqual({
                    id: expect.any(Number),
                });
            });
        });
    });
});

describe('GET /credentials/:id', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/credentials/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/credentials/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/credentials/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if credential is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const credential = await createCredential(user2);

            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and user credential', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const credential = await createCredential(user);

            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: credential.id,
                title: credential.title,
                url:credential.url,
                username: credential.username,
                password: cryptr.decrypt(credential.password),
                userId: credential.userId
            });
        });
    });
});

describe('DELETE /credentials/:id', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/credentials/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.delete('/credentials/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.delete('/credentials/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if credential is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const credential = await createCredential(user2);

            const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and the user credential', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const credential = await createCredential(user);

            const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
        });
    });
});