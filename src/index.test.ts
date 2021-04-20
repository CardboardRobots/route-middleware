import request from 'supertest';
import { createHandler, createServer } from 'sierra';

describe('RouteMiddleware', function () {
    it('should route', async function () {
        const server = createServer(createHandler().use(async () => ({})));
        const { body } = await request(server).get('/').expect(200);
        expect(body).toStrictEqual({});
    });
});
