const jwt = require('jsonwebtoken');
const secretKey = 'testTokenSecret'; 


const generateJWT = (userData) => {
    const token = jwt.sign(userData, secretKey, { expiresIn: '1h' }); 
    return token;
  };
  
  // Function to decode JWT
  const decodeJWT = (bearerToken) => {
    try {
      const token = bearerToken.replace(/^Bearer\s/, '');
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null; // Token is invalid or expired
    }
  };
  
  module.exports = {generateJWT, decodeJWT}