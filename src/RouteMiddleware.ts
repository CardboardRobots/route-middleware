import { Context, NotFoundError } from 'sierra';

import { Endpoint } from './endpoint';
import { createRouteData, RouteData } from './RouteData';

// eslint-disable-next-line @typescript-eslint/ban-types
export class RouteMiddleware<CONTEXT extends Context<{}> = Context<{}>> {
    endpoints: Endpoint<CONTEXT & Context<RouteData>, any, any, any, any>[] = [];

    callback = (context: CONTEXT & Context<RouteData>) => {
        const { data, request } = context;

        data.route = createRouteData(request);

        const result = this.match(context);
        if (!result) {
            throw new NotFoundError();
        }
        const { endpoint, match } = result;
        return endpoint.run(context, match);
    };

    match(context: CONTEXT & Context<RouteData>) {
        const { method, url } = context.data.route;
        for (const endpoint of this.endpoints) {
            const match = endpoint.match(method, url.pathname);
            if (match) {
                return {
                    endpoint,
                    match,
                };
            }
        }
        return undefined;
    }

    add(...endpoints: Endpoint<CONTEXT & Context<RouteData>, any, any, any, any>[]) {
        this.endpoints = [...this.endpoints, ...endpoints];
    }
}
