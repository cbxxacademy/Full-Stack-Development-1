/* *******************
 * CONTROLLERS IMPORT
 *********************/
import sessionController from '../../controllers/session.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const sessionRoutesEndpoint = (router) => {
    router.post('/login', sessionController.sessionLogin);
    router.get('/logout', sessionController.sessionLogout);
    router.post('/create', sessionController.sessionCreateUser);
    router.delete('/delete', sessionController.sessionDeleteUser);
}

/* *******
 * EXPORTS
 *********/
export default { sessionRoutesEndpoint };