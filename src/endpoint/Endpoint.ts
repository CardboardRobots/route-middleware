import { Route } from '@cardboardrobots/route';
import { Context, Verb } from 'sierra';

export class Endpoint<ROUTE extends Route<any, any>, CONTEXT extends Context, RESULT> {
    methods: Verb[];
    route: ROUTE;
    callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>;

    constructor(
        methods: Verb[],
        route: ROUTE,
        callback: (context: CONTEXT, match: Record<string, unknown>) => Promise<RESULT>
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

    createObject(array: ReturnType<this['route']['match']>) {
        const output: Record<string, string> = {};
        this.route.names.reduce((output, name, index) => {
            output[name] = array[index];
            return output;
        }, output);
        return output;
    }

    run(context: CONTEXT, match: Record<string, unknown>) {
        return this.callback(context, match);
    }
}
