import { Server } from 'http';

import request from 'supertest';
import { Context, createHandler, createServer, HandlerContext } from 'sierra';
import { Pipeline } from '@cardboardrobots/pipeline';
import { createRequest } from '@cardboardrobots/test-util';

import { RouteMiddleware } from './RouteMiddleware';
import { CreateEndpoint, CreateRoutes } from './endpoint';
import { RouteData } from './RouteData';

describe('RouteMiddleware', function () {
    describe('context', function () {
        describe('should create the route object', function () {
            it('should initialize from IncomingMessage and ServerResponse', function () {
                const context = new Context(
                    ...createRequest({
                        method: 'get',
                        url: 'http://localhost/test',
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/json',
                        },
                    })
                );
                const pipeline = new Pipeline().use(new RouteMiddleware().callback);
                pipeline.run(context);
                const { data } = context as Context<RouteData>;
                const { route } = data;

                expect(route.method).toBe('get');
                expect(route.contentType.mediaType).toBe('application/json');
                expect(route.accept).toStrictEqual(['application/json']);
            });

            it('should initialize httpBoundary', function () {
                const context = new Context(
                    ...createRequest({
                        headers: {
                            'content-type': 'multipart/form-data; boundary=something',
                        },
                    })
                );
                const pipeline = new Pipeline().use(new RouteMiddleware().callback);
                pipeline.run(context);
                const { data } = context as Context<RouteData>;
                const { route } = data;

                expect(route.contentType.boundary).toBe('something');
            });

            it('should ignore improper httpBoundary', function () {
                const context = new Context(
                    ...createRequest({
                        headers: {
                            'content-type': 'multipart/form-data; boundary',
                        },
                    })
                );
                const pipeline = new Pipeline().use(new RouteMiddleware().callback);
                pipeline.run(context);
                const { data } = context as Context<RouteData>;
                const { route } = data;

                expect(route.contentType.boundary).toBe(undefined);
            });
        });
    });

    describe('route', function () {
        let server: Server;

        beforeAll(() => {
            const baseHandler = createHandler().use<{ session: string }>(async () => {});
            type BaseContext = HandlerContext<typeof baseHandler>;
            const router = new RouteMiddleware<BaseContext>();
            const handler = baseHandler.use(router.callback);
            type ApplicationContext = HandlerContext<typeof handler>;
            interface Controller extends CreateRoutes<ApplicationContext> {}
            const TestController: Controller = ({ get }) => {
                return [
                    get(
                        () => '/test',
                        () => ({})
                    ).use(async () => {
                        return {};
                    }),
                ];
            };
            router.add(...TestController(CreateEndpoint));
            server = createServer(handler);
        });

        it('should run matching routes', async function () {
            const { body } = await request(server).get('/test');
            expect(body).toStrictEqual({});
        });

        it('should throw if no match', async function () {
            const { body } = await request(server).get('/other').expect(404);
            expect(body).toBe('not found');
        });
    });
});
