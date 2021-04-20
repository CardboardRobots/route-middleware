import { Verb } from 'sierra';

import { Endpoint } from './Endpoint';

describe('Route', function () {
    describe('constructor', function () {
        it('should initialize properties', function () {
            const method = async () => {};
            const route = new Endpoint(Verb.Get, 'test', method, 'template');
            expect(route.verbs).toStrictEqual([Verb.Get]);
            expect(route.name).toBe('test');
            expect(route.method).toBe(method);
            expect(route.template).toBe('template');
            expect(route.config).toBeUndefined();
        });
    });

    describe('init', function () {
        it('should create config', function () {
            const method = async () => {};
            const route = new Endpoint(Verb.Get, 'test', method, 'template');
            route.init();
            expect(route.config).toBeDefined();
            expect(route.config?.regex).toStrictEqual(/^\/test$/i);
            expect(route.config?.parameters).toStrictEqual([]);
        });

        it('should handle parameterized routes', function () {
            const method = async () => {};
            const route = new Endpoint(Verb.Get, 'test/:id', method, 'template');
            route.init();
            expect(route.config).toBeDefined();
            expect(route.config?.regex).toStrictEqual(/^\/test\/([^/]*)$/i);
            expect(route.config?.parameters).toStrictEqual(['id']);
        });
    });
});
