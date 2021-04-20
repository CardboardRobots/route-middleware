import { Context, NoRouteFoundError } from 'sierra';

import { Endpoint } from './Endpoint';
import { RouteGroup } from './RouteGroup';

export class RouteMiddleware extends RouteGroup {
    allRoutes: Endpoint<any, any, any>[] = [];

    init() {
        const allRoutes = super.init();
        this.allRoutes = allRoutes;
        this.allRoutes.sort(sortRoutes);
        return allRoutes;
    }

    handle = async (context: Context, value?: any) => {
        const pathname = getPathname(context);
        // Find a matching route
        let route: Endpoint<any, any, any> | undefined;
        // Store match array
        let match: null | RegExpMatchArray = null;
        for (const _route of this.allRoutes) {
            match = _route.match(context.method, pathname);
            if (match) {
                route = _route;
                break;
            }
        }
        if (route) {
            return route.run(context as any, value, match);
        } else {
            throw new NoRouteFoundError();
        }
    };
}

/**
 * Compares two Routes for sorting.
 * @param routeA - the first Route
 * @param routeB - the second Route
 */
export function sortRoutes(routeA: Endpoint<any, any, any>, routeB: Endpoint<any, any, any>) {
    return (routeA.config?.firstParamIndex || 0) - (routeB.config?.firstParamIndex || 0);
}

function getPathname(context: Context) {
    // Remove ending '/' from pathname, unless only single '/'.
    let pathname = context.url.pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }
    return pathname;
}
