const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, 'AbdullahSecretKey', { expiresIn: '1h' });
};

module.exports = {
  generateToken,
};

