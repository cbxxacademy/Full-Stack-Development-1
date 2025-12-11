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
 * MIDDLEWARE - JWT Authentication
 * Validates JWT token from cookies using Authorization header as secret
 * Sets req.user with decoded token data for downstream use
 */
export const jwtAuthToken = (req, res, next) => {
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