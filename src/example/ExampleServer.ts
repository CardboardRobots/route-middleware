import { createEndpoint } from '../endpoint';

import { TestController } from './controllers/TestController';
import { createApplication } from './createApplication';

export const { handler, router, server } = createApplication();

router.add(...TestController(createEndpoint));
