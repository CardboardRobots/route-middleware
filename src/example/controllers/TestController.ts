import { AddRoute } from '../createApplication';
import { Create } from '../../endpoint';

export const addRoute: AddRoute = () => {
    return [
        Create.get(
            () => '/',
            () => ({}),
            async ({ data }) => {
                const { session } = data;
                const { user } = session;
                return { user };
            }
        ),
        Create.get(
            (id) => `/test/${id}`,
            (id) => ({ id }),
            async ({ data }) => {
                const { session } = data;
                const { user } = session;
                return { user };
            }
        ),
    ];
};
