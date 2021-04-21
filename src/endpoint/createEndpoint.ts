import { ParseFunction, Route, RouteFunction } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

import { Endpoint } from './Endpoint';

export function createEndpoint<
    CONTEXT extends Context,
    T extends RouteFunction,
    U extends ParseFunction<T, any>,
    RESULT
>(method: Verb, route: T, parser: U, callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>) {
    return new Endpoint([method], new Route(route, parser), callback);
}

export function get<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Get, route, parser, callback);
}

export function post<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Post, route, parser, callback);
}

export function put<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Put, route, parser, callback);
}

export function patch<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Patch, route, parser, callback);
}

export function del<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Delete, route, parser, callback);
}

export function options<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Options, route, parser, callback);
}

export function head<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
    route: T,
    parser: U,
    callback: (context: CONTEXT, match: ReturnType<U>) => Promise<RESULT>
) {
    return createEndpoint(Verb.Head, route, parser, callback);
}
