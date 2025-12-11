/* *********************
 * THIRD-PARTY LIBRARIES
 ***********************/
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

/* *************************
 * INTERNAL MODULES / SCHEMAS
 ****************************/
import userSchema from '../../shared/db/mongodb/schemas/user.Schema.js';

/* **************
 * ROUTE HANDLERS
 ****************/
/**
 * POST - /user-create
 * Creates a new user account for JWT testing
 * Required: email, password
 */
const sessionCreateUser = async (req, res) => {
    try {
        // Extract required fields from request body
        const { email, password } = req.body;

        // Validate all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'email and password are required' 
            });
        }

        // Validate password length
        if (password.length < 3) {
            return res.status(400).json({ 
                error: 'Invalid password',
                message: 'Password must be at least 3 characters long' 
            });
        }

        // Check if user with same email already exists
        const existingUser = await userSchema.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                error: 'User already exists',
                message: 'A user with this email already exists' 
            });
        }

        // Create new user
        const userData = {
            email: email.toLowerCase(),
            password
        };

        const user = await userSchema.create(userData);
        
        res.status(201).json({ 
            message: 'User created successfully',
            data: user 
        });

    } catch (error) {
        console.error('CreateUser error:', error.message);
        
        // Add proper Mongoose error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'User already exists',
                message: 'A user with this email already exists' 
            });
        }
        
        res.status(500).json({ 
            error: 'Server error creating user',
            message: error.message 
        });
    }
};

/**
 * DELETE - /user-delete
 * Deletes a user based on query parameters
 * First checks to ensure query returns only one user
 * Returns specific error if improper request or multiple records returned
 */
const sessionDeleteUser = async (req, res) => {
    try {
        const query = req.query;

        // Validate query parameters exist
        if (!query || Object.keys(query).length === 0) {
            return res.status(400).json({ 
                error: 'No query parameters provided',
                message: 'Please specify valid filter parameters to delete a user (e.g., ?email=user@example.com)' 
            });
        }

        // Find users matching the query
        const users = await userSchema.find(query);

        // Check if no users found
        if (users.length === 0) {
            return res.status(404).json({ 
                error: 'No user found',
                message: 'No user found matching the provided parameters' 
            });
        }

        // Check if multiple users match (unsafe to delete)
        if (users.length > 1) {
            return res.status(400).json({ 
                error: 'Multiple users matched',
                message: `Multiple users (${users.length}) matched the query. Please provide more specific parameters to identify a single user` 
            });
        }

        // Safe to delete - only one user matches
        const userToDelete = users[0];
        await userSchema.deleteOne({ _id: userToDelete._id });

        res.status(200).json({ 
            message: 'User deleted successfully',
            data: userToDelete 
        });

    } catch (error) {
        console.error('DeleteUser error:', error.message);
        res.status(500).json({ error: 'Server error deleting user' });
    }
};

/**
 * POST - /login
 * Handles user login and JWT token creation
 * Required: email, password in request body
 * Sets HTTP-only cookie with JWT token
 */
const sessionLogin = async (req, res) => {
    try {
        // Extract required fields from request body
        const { email, password } = req.body;

        // Validate all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'email and password are required' 
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format',
                message: 'Please provide a valid email address' 
            });
        }

        // Check if SECRET key exists in environment
        if (!process.env.SECRET) {
            return res.status(500).json({ 
                error: 'Server configuration error',
                message: 'JWT secret not configured' 
            });
        }

        // Find user by email (include password for comparison)
        const user = await userSchema.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect' 
            });
        }

        // Verify password using bcrypt directly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect' 
            });
        }

        // Create user object for JWT payload
        const userPayload = { 
            id: user._id,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        // Create JWT token with payload + secret key + 24h expiration
        const token = jwt.sign(
            { USER: userPayload }, 
            process.env.SECRET, 
            { expiresIn: '24h' }
        );

        // Set HTTP-only cookie with JWT token
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });

        res.status(200).json({
            message: 'Login successful',
            user: user.email,
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ 
            error: 'Server error during login',
            message: error.message 
        });
    }
};

/**
 * GET - /logout
 * Handles user logout by clearing JWT cookie
 * No authentication required for logout
 */
const sessionLogout = async (req, res) => {
    try {
        // Check if user has a token cookie
        if (req.cookies.token) {
            // Clear the token cookie
            res.clearCookie('token');
            res.status(200).json({ 
                message: 'Logged out successfully',
                status: 'success' 
            });
        } else {
            res.status(200).json({ 
                message: 'Already logged out',
                status: 'already_logged_out' 
            });
        }

    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ 
            error: 'Server error during logout',
            message: error.message 
        });
    }
};

/* *******
 * EXPORTS
 *********/
export default {
    sessionCreateUser,
    sessionDeleteUser,
    sessionLogin,
    sessionLogout
};