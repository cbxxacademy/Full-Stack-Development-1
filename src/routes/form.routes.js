/* *******************
 * CONTROLLERS IMPORT
 *********************/
import formController from '../controllers/form.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const formsRoutesEndpoint = (app) => {
  app.post('/contact-us', formController.contactUs);
}

/* *******
 * EXPORTS
 *********/
export default { formsRoutesEndpoint };