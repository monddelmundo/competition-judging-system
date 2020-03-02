const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();
//const secret = 'mysecretsshhh';
const secret = process.env.SECRET;

const publicKey = fs.readFileSync('./public.key', 'utf-8');

const withAuth = function(req, res, next) {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, publicKey, {
      maxAge: '1h',
      algorithms: 'RS256'
    }, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.username = decoded.username;
        req.role = decoded.role;
        next();
      }
    });
  }
}

module.exports = withAuth;