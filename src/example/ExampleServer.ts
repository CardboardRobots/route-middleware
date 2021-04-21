import { createEndpoint } from '../endpoint';

import { addRoute } from './controllers/TestController';
import { createApplication } from './createApplication';

export const { handler, router, server } = createApplication();

router.add(...addRoute(createEndpoint));
