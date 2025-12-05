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
import middleware from './src/shared/middleware/base-middleware.js';


/* *************
 * ROUTE IMPORTS
 ***************/
import healthRoutes from './src/routes/health.routes.js';
import calculationRoutes from './src/routes/calculation.routes.js';
import formRoutes from './src/routes/form.routes.js';
import agentRoutes from './src/routes/agent.routes.js';
import regionRoutes from './src/routes/region.routes.js';


/* ********************
 * SERVER CONFIGURATION
 **********************/
const PORT = process.env.PORT || 3004;
const app = express();


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
app.use(express.static('./src/public')) //serves our static genesis project
app.use(middleware.logger);


/* ******************
 * ROUTE REGISTRATION
 ********************/
healthRoutes.healthRoutesEndpoint(app);
calculationRoutes.calculationRoutesEndpoint(app);
formRoutes.formsRoutesEndpoint(app);
agentRoutes.agentRoutesEndpoint(app);
regionRoutes.regionRoutesEndpoint(app);


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
