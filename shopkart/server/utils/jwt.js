const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'shopkart_super_secret_jwt_key_2026_secured',
    { expiresIn: '30d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'shopkart_super_secret_jwt_key_2026_secured'
  );
};

module.exports = { generateToken, verifyToken };
