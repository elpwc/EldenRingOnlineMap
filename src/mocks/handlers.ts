import mapHandlers from './handles/map';
import isRequestHandles from './handles/isRequest';
import checkAdminHandles from './handles/checkAdmin';
import apothegmHandles from './handles/apothegm';

export const handlers = [
    ...mapHandlers,
    ...isRequestHandles,
    ...checkAdminHandles,
    ...apothegmHandles,
]
