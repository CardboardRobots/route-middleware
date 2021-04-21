import { Route } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

type RouteReturn<T> = T extends Route<any, infer U> ? U : never;

export class Endpoint<CONTEXT extends Context, ROUTE extends Route<any, any>, RESULT> {
    methods: Verb[];
    route: ROUTE;
    callback: (context: CONTEXT, match: RouteReturn<ROUTE>) => Promise<RESULT>;

    constructor(
        methods: Verb[],
        route: ROUTE,
        callback: (context: CONTEXT, match: RouteReturn<ROUTE>) => Promise<RESULT>
    ) {
        this.methods = methods;
        this.route = route;
        this.callback = callback;
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
        return this.callback(context, match);
    }
}
