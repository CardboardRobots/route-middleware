import { Route } from '@cardboardrobots/route';
import { Verb } from 'sierra';

import { Endpoint } from './Endpoint';

describe('Endpoint', function () {
    describe('match', function () {
        const endpoint = new Endpoint(
            [Verb.Get],
            new Route(
                (id) => `test/${id}`,
                (id) => ({ id })
            )
        );
        it('should match pathnames', function () {
            const result = endpoint.match(Verb.Get, 'test/1');
            expect(result).toStrictEqual({ id: '1' });
        });

        it('should not match other pathnames', function () {
            const result = endpoint.match(Verb.Get, 'test');
            expect(result).toBeUndefined();
        });
    });
});
