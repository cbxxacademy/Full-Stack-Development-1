/* *************************
 * ENVIRONMENT CONFIGURATION
 ***************************/
import dotenv from "dotenv";
dotenv.config();


/* *****************
 * CORE DEPENDENCIES
 *******************/
import express from "express";


/* ****************
 * DATABASE IMPORTS
 ******************/
import mongoManager from './src/shared/db/mongodb/mongo-manager.js';


/* ******************
 * MIDDLEWARE IMPORTS
 ********************/
import { apiLogger } from './src/shared/middleware/api-logger.middleware.js';
import { authHeader } from './src/shared/middleware/auth-header.middleware.js';


/* *************
 * ROUTE IMPORTS
 ***************/
// Public routes
import healthRoutes from './src/routes/open/health.routes.js';
// Protected routes
import quoteRoutes from './src/routes/protected/quote.routes.js';
import formRoutes from './src/routes/protected/form.routes.js';
import agentRoutes from './src/routes/protected/agent.routes.js';
import regionRoutes from './src/routes/protected/region.routes.js';


/* ********************
 * SERVER CONFIGURATION
 **********************/
const PORT = process.env.PORT || 3004;
const app = express();
const openRouter = express.Router();
const protectedRouter = express.Router();


/* ***********************
 * DATABASE INITIALIZATION
 *************************/
try {
    await mongoManager.openMongoConnection();
    console.log('✅ Database connected successfully');
} catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
}


/* ***********************
 * GLOBAL MIDDLEWARE SETUP
 *************************/
app.use(express.json());
app.use(express.static('./src/public'));
app.use(apiLogger);


/* **************************
 * ROUTER-SPECIFIC MIDDLEWARE
 ****************************/
// Authentication middleware for protected routes only
protectedRouter.use(authHeader);


/* ******************
 * ROUTE REGISTRATION
 ********************/
// Open routes (no authentication required)
healthRoutes.healthRoutesEndpoint(openRouter);
// Protected routes (authentication required)
quoteRoutes.quoteRoutesEndpoint(protectedRouter);
formRoutes.formRoutesEndpoint(protectedRouter);
agentRoutes.agentRoutesEndpoint(protectedRouter);
regionRoutes.regionRoutesEndpoint(protectedRouter);


/* *************
 * MOUNT ROUTERS
 ***************/
app.use('/', openRouter);
app.use('/', protectedRouter);


/* **************
 * ERROR HANDLING
 ****************/
// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `${req.method} ${req.originalUrl} does not exist`
    });
});


/* **************
 * SERVER STARTUP
 ****************/
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Base URL: http://localhost:${PORT}`);
});


/* *****************
 * GRACEFUL SHUTDOWN
 *******************/
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server gracefully...');
    try {
        await mongoManager.closeMongoConnection();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error.message);
        process.exit(1);
    }
});