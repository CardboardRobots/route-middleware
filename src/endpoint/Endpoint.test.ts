import { Route } from '@cardboardrobots/route';
import { Verb } from 'sierra';

import { Endpoint } from './Endpoint';

describe('Endpoint', function () {
    it('should match routes', function () {
        const endpoint = new Endpoint(
            [Verb.Get],
            new Route(
                (id) => `test/${id}`,
                (id) => ({ id })
            ),
            async () => {}
        );
        const result = endpoint.match(Verb.Get, 'test/1');
        expect(result).toStrictEqual({ id: '1' });
    });
});
