const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

const protectedRoute = (req, res, next) => {
  const token = req.headers['access-token'];
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(422).json(err);
      }
      // if token is present, make sure it is associated with the user that is making the request
      userController.verifyUser(decoded.id).then(result => {
        if (result.facebookProviderId === req.headers.userid) {
          req.user = result.id;
          next();
        } else {
          res.status(422).send({
            message: 'No user found'
          });
        }
      });
    });
  } else {
    // if there is no token
    res.status(422).send({
      message: 'No token provided.'
    });
  }
};

module.exports = protectedRoute;
