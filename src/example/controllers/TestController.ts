import { Verb } from 'sierra';

import { AddRoute } from '../createApplication';

const TEST_CONTROLLER = 'test';
export const addRoute: AddRoute = (create) => {
    return [
        create(
            Verb.Get,
            () => '/',
            () => ({})
        ).use(async ({ data }) => {
            const { session } = data;
            const { user } = session;
            return { user };
        }),

        create(
            Verb.Get,
            (id) => `/${TEST_CONTROLLER}/${id}`,
            (id) => ({ id })
        ).use(async ({ data }) => {
            const { params, session } = data;
            const { user } = session;
            const { id } = params;
            return { user, id };
        }),

        create(
            Verb.Get,
            (id) => `/${TEST_CONTROLLER}/edit/${id}`,
            (id) => ({ id })
        ).use(async ({ data }, { id }) => {
            const { session } = data;
            const { user } = session;
            return { user, id };
        }),
    ];
};
