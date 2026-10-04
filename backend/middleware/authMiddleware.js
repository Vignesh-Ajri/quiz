const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/response');

/**
 * Authenticate: reads access token from Authorization header or cookie.
 * Attaches req.user = { _id, name, email, role }
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Try Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback: access_token cookie
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return sendError(res, 'Access token required', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('_id name email role isActive');

    if (!user) return sendError(res, 'User not found', 401, 'UNAUTHORIZED');
    if (!user.isActive) return sendError(res, 'Account is deactivated', 403, 'FORBIDDEN');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Access token expired', 401, 'TOKEN_EXPIRED');
    }
    return sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
  }
};

/**
 * Authorize: check that req.user has one of the given roles.
 * Must be used AFTER authenticate.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401, 'UNAUTHORIZED');
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403, 'FORBIDDEN');
    }
    next();
  };
};

module.exports = { authenticate, authorize };