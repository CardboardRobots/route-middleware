import request from 'supertest';
import { createHandler, createServer, HandlerContext, Verb } from 'sierra';
import { Route } from '@cardboardrobots/route';

import { RouteMiddleware } from './RouteMiddleware';
import { Endpoint } from './endpoint';

describe('RouteMiddleware', function () {
    describe('route', function () {
        const handler = createHandler().use<{ session: string }>(async () => {});

        const middleware = new RouteMiddleware<HandlerContext<typeof handler>>();
        middleware.endpoints.push(
            new Endpoint([Verb.Get], new Route(() => '/test')).use(async () => {
                return {};
            })
        );
        const routeHandler = handler.use(middleware.callback);

        const server = createServer(routeHandler);

        it('should run matching routes', async function () {
            const { body } = await request(server).get('/test').expect(200);
            expect(body).toStrictEqual({});
        });

        it('should throw if no match', async function () {
            const { body } = await request(server).get('/other').expect(404);
            expect(body).toBe('not found');
        });
    });
});
