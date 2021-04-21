import * as path from 'path';

import { DirectiveType, Middleware, Pipeline } from '@cardboardrobots/pipeline';
import { Context, Verb } from 'sierra';

export class RouteEndpoint<VALUE, RESULT, PARAMS extends Record<string, unknown>> {
    pipeline: Pipeline<Context<{ params: PARAMS }>, VALUE, RESULT> = new Pipeline();
    readonly verbs: Verb[];
    readonly name: string | RegExp;
    readonly method: Middleware<Context<{ params: PARAMS }>, any, any>;
    // TODO: Should template be on Route?
    // TODO: Should this be readonly?
    template?: string;

    config?: {
        readonly regex: RegExp;
        readonly parameters: string[];
        /**
         * If `name` is a RegExp, `firstParamIndex` is -1
         *
         * Otherwise, `firstParamIndex` is the index of the first parameter in `name`
         */
        readonly firstParamIndex: number;
    };

    // TODO: Change to non-overload
    constructor(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context<{ params: PARAMS }>, any, any>,
        template?: string
    );

    constructor(
        verbs: Verb | Verb[],
        name: string | RegExp,
        middleware: Middleware<Context<{ params: PARAMS }>, any, any>[],
        method: Middleware<Context<{ params: PARAMS }>, any, any>,
        template?: string
    );

    constructor(verbs: Verb | Verb[], name: string | RegExp, paramA: any, paramB?: any, paramC?: any) {
        this.verbs = verbs instanceof Array ? verbs : [verbs];
        this.name = name;
        switch (typeof paramA) {
            case 'function':
                this.method = paramA;
                this.template = paramB;
                break;
            case 'object':
                if (paramA instanceof Array) {
                    for (const _middleware of paramA) {
                        this.pipeline.use(_middleware);
                    }
                }
                this.method = paramB;
                this.template = paramC;
                break;
            default:
                this.method = undefined as any;
        }
    }

    init(base?: string) {
        if (this.name instanceof RegExp) {
            this.config = {
                regex: this.name,
                parameters: [],
                firstParamIndex: -2,
            };
        } else {
            const name = getName(base, this.name);
            const directories = name.replace('\\', '/').split('/');
            const parts = directories.map((directory) => (directory.startsWith(':') ? '([^/]*)' : directory));
            const index = directories.findIndex((part) => part.startsWith(':'));
            const regex = new RegExp(`^\\/${parts.join('\\/')}$`, 'i');
            const parameters = directories
                .filter((directory) => directory.startsWith(':'))
                .map((directory) => directory.substr(1));
            const firstParamIndex = index;
            this.config = {
                regex,
                parameters,
                firstParamIndex,
            };
        }
    }

    match(verb: Verb, pathname: string) {
        // TODO: Remove this.config undefined check
        if (this.verbs.indexOf(verb) >= 0 && this.config) {
            return pathname.match(this.config.regex);
        } else {
            return null;
        }
    }

    getParams(match: null | RegExpMatchArray) {
        const params: Record<string, string> = {};
        if (match) {
            this.config?.parameters.forEach((name, index) => {
                params[name] = match[index + 1];
            });
        }
        return Object.freeze(params) as PARAMS;
    }

    async run(context: Context<{ params: PARAMS }>, value: VALUE, match: null | RegExpMatchArray) {
        context.template = context.template || this.template;
        context.data.params = this.getParams(match);
        const result = await this.pipeline.run(context, value);
        // TODO: Should we continue with both End and Exit?
        // We could treat Exit as another version of Error.
        switch (result.type) {
            case DirectiveType.End:
            case DirectiveType.Exit:
                return this.method(context, result.value);
            default:
                return result;
        }
    }
}

/**
 * If `name` starts with `"~"`, do nothing.
 *
 * Otherwise, join `base` and `name`.
 *
 * Result must not end in `"/"`.
 *
 * @param base
 * @param name
 */
function getName(base = '', name: string) {
    let result: string;
    if (name.startsWith('~')) {
        const fixedName = name.substr(1);
        result = path.posix.join(fixedName);
    } else {
        const fixedBase = base.replace('\\', '/');
        result = path.posix.join(fixedBase, name);
    }
    if (result.startsWith('/')) {
        result = result.substr(1);
    }
    if (result.endsWith('/')) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}
