/* *******************
 * CONTROLLERS IMPORT
 *********************/
import healthController from '../controllers/health.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const healthRoutesEndpoint = (app) => {
  app.get('/hello', healthController.hello);
  app.get('/status', healthController.status);
  app.get('/error', healthController.error);
}

/* *******
 * EXPORTS
 *********/
export default { healthRoutesEndpoint };