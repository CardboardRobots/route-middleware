import * as path from 'path';

import { Middleware } from '@cardboardrobots/pipeline';
import { Context, Verb } from 'sierra';

import { RouteEndpoint } from './RouteEndpoint';

export class RouteGroup {
    base: string;
    endpoints: RouteEndpoint<any, any, any>[] = [];
    routeGroups: RouteGroup[] = [];

    constructor(base = '') {
        this.base = base;
    }

    // TODO: Change to non-overload
    endpoint(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context, any, any>
    ): RouteEndpoint<any, any, any>;

    endpoint(
        verbs: Verb | Verb[],
        name: string | RegExp,
        middleware: Middleware<Context, any, any>[],
        method: Middleware<Context, any, any>
    ): RouteEndpoint<any, any, any>;

    endpoint(verbs: Verb | Verb[], name: string | RegExp, paramA: any, paramB?: any) {
        const route = new RouteEndpoint(verbs, name, paramA, paramB);
        this.endpoints.push(route);
        return route;
    }

    add(endpoint: RouteEndpoint<any, any, any>) {
        this.endpoints.push(endpoint);
    }

    remove(endpoint: RouteEndpoint<any, any, any>) {
        const index = this.endpoints.indexOf(endpoint);
        if (index >= 0) {
            return Boolean(this.endpoints.splice(index, 1).length);
        } else {
            return false;
        }
    }

    removeByName(name: string | RegExp) {
        const index = this.endpoints.findIndex((endpoint) => endpoint.name === name);
        if (index >= 0) {
            return Boolean(this.endpoints.splice(index, 1).length);
        } else {
            return false;
        }
    }

    addGroup(group: RouteGroup) {
        this.routeGroups.push(group);
    }

    removeGroup(group: RouteGroup) {
        const index = this.routeGroups.indexOf(group);
        if (index >= 0) {
            return Boolean(this.routeGroups.splice(index, 1).length);
        } else {
            return false;
        }
    }

    init(parentBase = '/') {
        const base = path.posix.join(parentBase, this.base);
        const routes: RouteEndpoint<any, any, any>[] = [];
        for (const route of this.endpoints) {
            route.init(base);
            routes.push(route);
        }
        for (const routeGroup of this.routeGroups) {
            const groupRoutes = routeGroup.init(base);
            for (const groupRoute of groupRoutes) {
                routes.push(groupRoute);
            }
        }
        return routes;
    }
}
