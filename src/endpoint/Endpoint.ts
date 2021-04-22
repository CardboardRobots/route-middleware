import { Middleware, MiddlewareContext, MiddlewareReturn, Pipeline } from '@cardboardrobots/pipeline';
import { Route } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

type RouteReturn<T> = T extends Route<any, infer U> ? ReturnType<U> : never;

export class Endpoint<
    CONTEXT extends Context,
    ROUTE extends Route<any, any>,
    PARAMSCONTEXT extends CONTEXT & Context<{ params: RouteReturn<ROUTE> }>,
    NEXTCONTEXT extends PARAMSCONTEXT,
    RESULT = RouteReturn<ROUTE>
> {
    methods: Verb[];
    route: ROUTE;
    pipeline: Pipeline<
        CONTEXT & Context<{ params: RouteReturn<ROUTE> }>,
        RouteReturn<ROUTE>,
        NEXTCONTEXT,
        RESULT
    > = new Pipeline();

    constructor(methods: Verb[], route: ROUTE) {
        this.methods = methods;
        this.route = route;
    }

    match(method: Verb, pathname: string) {
        if (this.methods.includes(method)) {
            return this.route.match(pathname);
        } else {
            return undefined;
        }
    }

    createObject(array: RouteReturn<ROUTE>) {
        const output: Record<string, string> = {};
        this.route.names.reduce((output, name, index) => {
            output[name] = array[index];
            return output;
        }, output);
        return output;
    }

    run(context: CONTEXT, match: RouteReturn<ROUTE>) {
        const nextContext: CONTEXT & Context<{ params: RouteReturn<ROUTE> }> = context as any;
        nextContext.data.params = match;
        return this.pipeline.run(nextContext, match);
    }

    use(middleware: Middleware<NEXTCONTEXT, RESULT, RESULT>): this;
    use<NEWDATA extends Record<string, any>, NEWRESULT = RESULT>(
        middleware: Middleware<NEXTCONTEXT & Context<Partial<NEWDATA>>, RESULT, NEWRESULT>
    ): Endpoint<CONTEXT, ROUTE, PARAMSCONTEXT, NEXTCONTEXT & Context<NEWDATA>, NEWRESULT>;

    use<MIDDLEWARE extends Middleware<any, any, any>>(
        middleware: MIDDLEWARE
    ): Endpoint<
        CONTEXT,
        ROUTE,
        PARAMSCONTEXT,
        NEXTCONTEXT & MiddlewareContext<MIDDLEWARE>,
        MiddlewareReturn<MIDDLEWARE>
    >;

    use(middleware: Middleware<any, any, any>): this {
        this.pipeline.use(middleware);
        return this;
    }
}
