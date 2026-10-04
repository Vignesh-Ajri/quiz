const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS,
  clearCookieOptions,
} = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required', 400, 'VALIDATION_ERROR');
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400, 'VALIDATION_ERROR');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 'Email already in use', 409, 'DUPLICATE_ERROR');

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token hash in DB
    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(
      res,
      {
        accessToken,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      },
      'Registration successful',
      201
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
    if (!user.isActive) return sendError(res, 'Account is deactivated', 403, 'FORBIDDEN');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(res, {
      accessToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return sendError(res, 'Refresh token required', 401, 'UNAUTHORIZED');

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return sendError(res, 'Invalid or expired refresh token', 401, 'INVALID_TOKEN');
    }

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return sendError(res, 'Refresh token reuse detected', 401, 'TOKEN_REUSE');
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
    res.cookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res, next) => {
  try {
    // Clear refresh token from DB
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.clearCookie('refresh_token', clearCookieOptions);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/auth/me  (update name/avatar)
const updateMe = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return sendSuccess(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, getMe, updateMe };