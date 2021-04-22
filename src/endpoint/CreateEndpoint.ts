import { ParseFunction, Route, RouteFunction } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

import { Endpoint } from './Endpoint';

export function create<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    method: Verb,
    route: T,
    parser: U
) {
    return new Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >([method], new Route(route, parser));
}

export function get<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Get, route, parser);
}

export function post<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Post, route, parser);
}

export function put<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Put, route, parser);
}

export function patch<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Patch, route, parser);
}

export function del<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Delete, route, parser);
}

export function options<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Options, route, parser);
}

export function head<CONTEXT extends Context, T extends RouteFunction, U extends ParseFunction<T, any>>(
    route: T,
    parser: U
) {
    return create<CONTEXT, T, U>(Verb.Head, route, parser);
}
