/* *************************
 * ENVIRONMENT CONFIGURATION
 ***************************/
import dotenv from "dotenv";
dotenv.config();

/* *********************
 * THIRD-PARTY LIBRARIES
 ***********************/
import jwt from 'jsonwebtoken';

/* **********************
 * MIDDLEWARE FUNCTIONS
 ***********************/
/**
 * MIDDLEWARE - Logger
 * Logs each API call with method, URL, and timestamp
 */
const logger = (req, res, next) => {
    try {
        console.log(`API call: ${req.method} on ${req.originalUrl} at ${new Date()}`);
        next();
    } catch (error) {
        console.error('Logger middleware error:', error.message);
        res.status(500).json({ 
            error: 'Internal server error in logging middleware',
            message: error.message 
        });
    }
};

/**
 * MIDDLEWARE - Authentication Token
 * Validates authentication token against environment variable
 * Requires Authorization header to match SECRET in .env file
 */
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Authorization header required',
                message: 'Please provide Authorization header' 
            });
        }

        // Validate environment secret exists
        if (!process.env.SECRET) {
            console.error('SECRET not configured in environment variables');
            return res.status(500).json({ 
                error: 'Server configuration error',
                message: 'Authentication not properly configured' 
            });
        }

        // Compare authorization header with environment secret
        if (authHeader !== process.env.SECRET) {
            return res.status(403).json({ 
                error: 'Access Forbidden',
                message: 'Invalid authorization token' 
            });
        }

        next();

    } catch (error) {
        console.error('Authentication middleware error:', error.message);
        res.status(500).json({ 
            error: 'Internal server error in authentication middleware',
            message: error.message 
        });
    }
};

/**
 * MIDDLEWARE - JWT Authentication
 * Validates JWT token from cookies using Authorization header as secret
 */
const jwtAuthToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = req.cookies.token;

        // Check if Authorization header exists (used as JWT secret)
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Authorization header required',
                message: 'Authorization header needed for JWT verification' 
            });
        }

        // Check if JWT token exists in cookies
        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication token required',
                message: 'JWT token not found in cookies' 
            });
        }

        // Verify JWT token with Authorization header as secret
        jwt.verify(token, authHeader, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                return res.status(403).json({ 
                    error: 'Invalid or expired token',
                    message: 'JWT token verification failed' 
                });
            }

            // Attach user data to request object for downstream middleware/routes
            req.user = user;
            next();
        });

    } catch (error) {
        console.error('JWT authentication middleware error:', error.message);
        res.status(500).json({ 
            error: 'Internal server error in JWT authentication middleware',
            message: error.message 
        });
    }
};

/* *******
 * EXPORTS
 *********/
export default {
    logger,
    jwtAuthToken,
    authenticateToken
};