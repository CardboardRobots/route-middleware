import { ParseFunction, Route, RouteFunction } from '@cardboardrobots/route';
import { Context, createHandler, createServer, Verb } from 'sierra';

import { Endpoint } from '../endpoint';
import { RouteMiddleware } from '../RouteMiddleware';

import { HandlerContext } from './HandlerTypes';

export interface SessionContext {
    session: { user: string };
}

export interface DatabaseContext {
    db: { connectionString: string };
}

export function createApplication() {
    const baseHandler = createHandler()
        .use<SessionContext, void>(async ({ data }) => {
            data.session = { user: 'name' };
        })
        .use<DatabaseContext>(async ({ data }) => {
            data.db = { connectionString: 'database' };
        });
    const router = new RouteMiddleware<HandlerContext<typeof baseHandler>>();
    const handler = baseHandler.use(router.callback);
    const server = createServer(handler);
    return {
        handler,
        router,
        server,
    };
}

type ApplicationContext = HandlerContext<ReturnType<typeof createApplication>['handler']>;

export interface AddRoute {
    (create: CreateFunction<ApplicationContext>): Endpoint<ApplicationContext, any, any, any, any>[];
}

interface CreateFunction<CONTEXT extends Context> {
    (): <T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
        method: Verb,
        route: T,
        parser: U
    ) => Endpoint<
        CONTEXT,
        Route<T, U>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        CONTEXT & Context<{ params: ReturnType<U> }>,
        RESULT
    >;
}

export function create<CONTEXT extends Context>() {
    return function createEndpoint<T extends RouteFunction, U extends ParseFunction<T, any>, RESULT>(
        method: Verb,
        route: T,
        parser: U
    ) {
        return new Endpoint<
            CONTEXT,
            Route<T, U>,
            CONTEXT & Context<{ params: ReturnType<U> }>,
            CONTEXT & Context<{ params: ReturnType<U> }>,
            RESULT
        >([method], new Route(route, parser));
    };
}
