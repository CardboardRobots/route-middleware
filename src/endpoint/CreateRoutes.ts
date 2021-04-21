import { ParseFunction, Route, RouteFunction } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

import { Endpoint } from './Endpoint';

export interface CreateRoutes<CONTEXT extends Context> {
    (createEndpoint: CreateEndpoint<CONTEXT>): Endpoint<CONTEXT, any, any, any, any>[];
}

interface CreateEndpoint<CONTEXT extends Context> {
    <T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(method: Verb, route: T, parser: U): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        RESULT
    >;
}

export function createEndpoint<
    CONTEXT extends Context,
    T extends RouteFunction,
    U extends ParseFunction<T, any>,
    RESULT
>(method: Verb, route: T, parser: U) {
    return new Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        RESULT
    >([method], new Route(route, parser));
}
