import { Controller } from '../createApplication';

const TEST = 'test';

export const TestController: Controller = ({ get }) => {
    return [
        get(
            () => '/',
            () => ({})
        ).use(async ({ data }) => {
            const { session } = data;
            const { user } = session;
            return { user };
        }),

        get(
            (id) => `/${TEST}/${id}`,
            (id) => ({ id })
        ).use(async ({ data }) => {
            const { params, session } = data;
            const { user } = session;
            const { id } = params;
            return { user, id };
        }),

        get(
            (id) => `/${TEST}/edit/${id}`,
            (id) => ({ id })
        ).use(async ({ data }, { id }) => {
            const { session } = data;
            const { user } = session;
            return { user, id };
        }),
    ];
};
