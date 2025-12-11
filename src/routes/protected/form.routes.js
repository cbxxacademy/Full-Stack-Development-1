/* *******************
 * CONTROLLERS IMPORT
 *********************/
import formController from '../../controllers/form.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const formRoutesEndpoint = (router) => {
    router.post('/contact-us', formController.contactUs);
}

/* *******
 * EXPORTS
 *********/
export default { formRoutesEndpoint };