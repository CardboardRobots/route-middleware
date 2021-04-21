import { Verb } from 'sierra';

import { AddRoute } from '../createApplication';

export const addRoute: AddRoute = (create) => {
    const createEndpoint = create();
    return [
        createEndpoint(
            Verb.Get,
            () => '/',
            () => ({})
        ).use(async ({ data }) => {
            const { session } = data;
            const { user } = session;
            return { user };
        }),
        createEndpoint(
            Verb.Get,
            (id) => `/test/${id}`,
            (id) => ({ id })
        ).use(async ({ data }) => {
            const { params, session } = data;
            const { user } = session;
            const { id } = params;
            return { user, id };
        }),
        createEndpoint(
            Verb.Get,
            (name) => `/name/${name}`,
            (name) => ({ name })
        ).use(async ({ data }, { name }) => {
            const { session } = data;
            const { user } = session;
            return { user, name };
        }),
    ];
};
