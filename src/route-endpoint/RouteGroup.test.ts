import { Verb } from 'sierra';

import { RouteEndpoint } from './RouteEndpoint';
import { RouteGroup } from './RouteGroup';

describe('RouteGroup', function () {
    describe('add', function () {
        it('should add a Route', function () {
            const routerMiddleware = new RouteGroup();
            const route = new RouteEndpoint(Verb.Get, 'test', async () => {});
            routerMiddleware.add(route);
            expect(routerMiddleware.endpoints).toContain(route);
        });
    });

    describe('remove', function () {
        it('should remove a Route', function () {
            const routerMiddleware = new RouteGroup();
            const route = new RouteEndpoint(Verb.Get, 'test', async () => {});
            routerMiddleware.add(route);
            routerMiddleware.remove(route);
            expect(routerMiddleware.endpoints).not.toContain(route);
        });
    });

    describe.skip('init', function () {
        it('should init all Routes', function () {});
    });
});
