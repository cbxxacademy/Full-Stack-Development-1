/* *******************
 * CONTROLLERS IMPORT
 *********************/
import calculationController from '../controllers/calculation.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const calculationRoutesEndpoint = (app) => {
  app.get('/calc-residential', calculationController.calcResidential);
}

/* *******
 * EXPORTS
 *********/
export default { calculationRoutesEndpoint };