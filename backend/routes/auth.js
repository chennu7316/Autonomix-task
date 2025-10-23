const express = require('express');
const router = express.Router();
const { authenticateUser, getUserById, authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const result = await authenticateUser(username, password);

    if (!result.success) {
      return res.status(401).json({
        error: result.error,
        code: 'INVALID_CREDENTIALS'
      });
    }

    logger.info(`User ${username} logged in successfully`);

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'LOGIN_ERROR'
    });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    logger.info(`User ${req.user.username} logged out`);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'PROFILE_ERROR'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  try {
    res.json({ 
      valid: true, 
      user: req.user 
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'VERIFY_ERROR'
    });
  }
});

// Get available users (for development)
router.get('/users', (req, res) => {
  try {
    const users = require('../middleware/auth').mockUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }));
    
    res.json({ users });
  } catch (error) {
    logger.error('Users fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'USERS_ERROR'
    });
  }
});

module.exports = router;


