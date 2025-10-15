const jwt = require('jsonwebtoken');
const User = require('./models/User.js');

const authenticate = async (req, res, next) => {
    try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send('No token provided, or token was not in the correct format');
      }
      const token = req.headers.authorization.split(' ')[1]; // Ensure this line does not throw an error
      const decoded = jwt.verify(token, process.env.EMAIL_SECRET  );


      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).send('Authentication failed: User not found');
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error); // Log the error to see what's going wrong
      return res.status(401).send('Authentication failed');
    }
  };
  

module.exports = authenticate;
