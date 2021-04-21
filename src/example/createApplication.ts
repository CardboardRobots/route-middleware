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

export interface AddRoute extends CreateRoutes<ApplicationContext> {}
