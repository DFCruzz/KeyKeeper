import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/users-factory";
import * as jwt from "jsonwebtoken"
import Cryptr from "cryptr"
import { createNetwork } from "../factories/network-factory";

const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`)

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('GET /network', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/network');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/network').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/network').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it('should respond with status 404 if user has no network', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if network is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const network = await createNetwork(user2);

            const response = await server.get(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and the user network', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = await createNetwork(user);

            const response = await server.get(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual({
                id: network.id,
                title: network.title,
                network: network.network,
                password: cryptr.decrypt(network.password),
                userId: network.userId
            });
        });
    });
});

describe('POST /network', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/network');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/network').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/network').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 400 if body is not found', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post('/network').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 if body is invalid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const body = { notNetwork: 'string' };

            const response = await server.post('/network').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe('When body is valid', () => {
            const generateValidBody = () => ({
                title: faker.lorem.words(),
                network: faker.lorem.word(),
                password: faker.internet.password(10),
            });

            it('should respond with status 409 if credential title already exists', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const network1 = generateValidBody();
                const network2 = await createNetwork(user);

                network1.title = network2.title;

                console.log(network1)

                const response = await server.post(`/network`).send(network1).set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(httpStatus.CONFLICT);
            });

            it('should respond with status 201 and credential id', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const network = generateValidBody();

                console.log(network)

                const response = await server.post(`/network`).send(network).set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(httpStatus.CREATED);
                expect(response.body).toEqual({
                    id: expect.any(Number),
                });
            });
        });
    });
});

describe('GET /network/:id', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/network/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/network/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/network/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if network is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const network = await createNetwork(user2);

            const response = await server.get(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and user network', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = await createNetwork(user);

            const response = await server.get(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: network.id,
                title: network.title,
                network: network.network,
                password: cryptr.decrypt(network.password),
                userId: network.userId
            });
        });
    });
});

describe('DELETE /network/:id', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/network/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.delete('/network/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.delete('/network/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if network is not from user', async () => {
            const user1 = await createUser();
            const token = await generateValidToken(user1);

            const user2 = await createUser();
            const network = await createNetwork(user2);

            const response = await server.delete(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and the user network', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = await createNetwork(user);

            const response = await server.delete(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
        });
    });
});