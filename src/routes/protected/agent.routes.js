/* *******************
 * CONTROLLERS IMPORT
 *********************/
import agentController from '../../controllers/agent.controller.js';

/* *******************
 * ROUTE CONFIGURATION
 *********************/
const agentRoutesEndpoint = (router) => {
    router.get('/email-list', agentController.agentEmailList);
    router.post('/agent-create', agentController.createAgent);
    router.get('/agents', agentController.getAllAgents);
    router.get('/agents-by-region', agentController.getAgentsByRegion);
    router.patch('/agent-update-info/:id', agentController.updateAgentInfo); // for id URL params
    router.patch('/agent-update-info/', agentController.updateAgentInfo); // for id Query/Body params
    router.delete('/agent-delete', agentController.deleteAgent);
}

/* *******
 * EXPORTS
 *********/
export default { agentRoutesEndpoint };