import { Route, RouteFunction } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

import { Endpoint } from './Endpoint';

export function createEndpoint<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    method: Verb,
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return new Endpoint([method], new Route(route), callback);
}

export function get<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Get, route, callback);
}

export function post<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Post, route, callback);
}

export function put<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Put, route, callback);
}

export function patch<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Patch, route, callback);
}

export function del<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Delete, route, callback);
}

export function options<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Options, route, callback);
}

export function head<T extends RouteFunction, CONTEXT extends Context, RESULT>(
    route: T,
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Head, route, callback);
}
