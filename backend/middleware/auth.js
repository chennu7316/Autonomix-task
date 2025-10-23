const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Mock users for development (in production, use a database)
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@insightboard.ai',
    password: 'admin123', // In production, this should be hashed
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@insightboard.ai', 
    password: 'user123',
    role: 'user'
  }
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({ 
      error: 'Invalid or expired token.',
      code: 'INVALID_TOKEN'
    });
  }
};


// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Mock authentication function
const authenticateUser = async (username, password) => {
  try {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      success: true, 
      user: userWithoutPassword,
      token: generateToken(userWithoutPassword)
    };
  } catch (error) {
    logger.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

// Get user by ID
const getUserById = (id) => {
  const user = mockUsers.find(u => u.id === parseInt(id));
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

module.exports = {
  authenticateToken,
  generateToken,
  authenticateUser,
  getUserById,
  mockUsers
};

