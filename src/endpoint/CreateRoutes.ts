import { ParseFunction, Route, RouteFunction } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

import { Endpoint } from './Endpoint';

interface Factories<CONTEXT extends Context> {
    create<T extends RouteFunction, U extends ParseFunction<T, any>>(
        method: Verb,
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    get<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    post<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    put<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    patch<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    del<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    options<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
    head<T extends RouteFunction, U extends ParseFunction<T, any>>(
        route: T,
        parser: U
    ): Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        ReturnType<U>
    >;
}

export interface CreateRoutes<CONTEXT extends Context> {
    (factories: Factories<CONTEXT>): Endpoint<CONTEXT, any, any, any, any>[];
}
