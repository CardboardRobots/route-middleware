import { addRoute } from './controllers/TestController';
import { create, createApplication } from './createApplication';

export const { handler, router, server } = createApplication();

router.add(...addRoute(create));
