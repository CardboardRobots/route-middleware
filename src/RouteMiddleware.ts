// import { Middleware } from '@cardboardrobots/pipeline';

import { Context, NotFoundError } from 'sierra';

import { Endpoint } from './endpoint';

export class RouteMiddleware<CONTEXT extends Context> {
    endpoints: Endpoint<any, CONTEXT, any>[] = [];

    callback = (context: CONTEXT) => {
        const result = this.match(context);
        if (!result) {
            throw new NotFoundError();
        }
        const { endpoint, match } = result;
        return endpoint.run(context, match);
    };

    match(context: CONTEXT) {
        const { method, url } = context;
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

    add(...endpoints: Endpoint<any, CONTEXT, any>[]) {
        this.endpoints = [...this.endpoints, ...endpoints];
    }
}
