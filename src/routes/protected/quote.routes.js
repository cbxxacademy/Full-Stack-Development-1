/* *******************
 * CONTROLLERS IMPORT
 *********************/
import quoteController from '../../controllers/quote.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const quoteRoutesEndpoint = (router) => {
    router.get('/calc-residential', quoteController.calculResidential);
}

/* *******
 * EXPORTS
 *********/
export default { quoteRoutesEndpoint };