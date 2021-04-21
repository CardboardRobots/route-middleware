import request from 'supertest';
import { createHandler, createServer, Verb } from 'sierra';
import { Route } from '@cardboardrobots/route';

import { RouteMiddleware } from './RouteMiddleware';
import { Endpoint } from './endpoint';
import { HandlerContext } from './example/HandlerTypes';

describe('RouteMiddleware', function () {
    it('should route', async function () {
        const handler = createHandler().use<{ session: string }>(async () => {});

        const middleware = new RouteMiddleware<HandlerContext<typeof handler>>();
        middleware.endpoints.push(
            new Endpoint([Verb.Get], new Route(() => '/test'), async () => {
                return {};
            })
        );
        const routeHandler = handler.use(middleware.callback);

        const server = createServer(routeHandler);

        const { body } = await request(server).get('/').expect(200);
        expect(body).toStrictEqual({});
    });
});
