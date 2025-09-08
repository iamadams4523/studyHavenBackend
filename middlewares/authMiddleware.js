const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: protect route
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ msg: 'User not found' });

      next();
    } catch (err) {
      console.error('AUTH ERROR:', err);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// Middleware: admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ msg: 'Forbidden: Admins only' });
  }
};

module.exports = { protect, adminOnly };
