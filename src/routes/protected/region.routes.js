/* *******************
 * CONTROLLERS IMPORT
 *********************/
import regionController from '../../controllers/region.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const regionRoutesEndpoint = (router) => {
    router.get('/region-avg', regionController.regionAvg);
    router.post('/region-create', regionController.createRegion);
    router.get('/region', regionController.getRegion);
    router.get('/all-stars', regionController.getAllStars);
}

/* *******
 * EXPORTS
 *********/
export default { regionRoutesEndpoint };