import { createHandler, createServer, HandlerContext } from 'sierra';

import { CreateRoutes } from '../endpoint';
import { RouteMiddleware } from '../RouteMiddleware';

export interface SessionContext {
    session: { user: string };
}

export interface DatabaseContext {
    db: { connectionString: string };
}

export function createApplication() {
    // Create baseHandler
    const baseHandler = createHandler()
        .use<SessionContext, void>(async ({ data }) => {
            data.session = { user: 'name' };
        })
        .use<DatabaseContext>(async ({ data }) => {
            data.db = { connectionString: 'database' };
        });
    type BaseContext = HandlerContext<typeof baseHandler>;

    // Create router
    const router = new RouteMiddleware<BaseContext>();

    // Create handler
    const handler = baseHandler.use(router.callback);

    // Create server
    const server = createServer(handler);

    return {
        handler,
        router,
        server,
    };
}

export type ApplicationContext = HandlerContext<ReturnType<typeof createApplication>['handler']>;

export interface Controller extends CreateRoutes<ApplicationContext> {}
