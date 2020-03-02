const express = require('express');
const withAuth = require('../middleware');
let { User } = require('../models/user.model');
const router = require('express').Router();

const app = express();

const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

router.route('/authenticate').post((req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect username or password'
        });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect username or password'
          });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .send(token);
        }
      });
    }
  });
});

router.get('/secret', withAuth, function(req, res) {
  res.send('The password is potato');
});

router.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

module.exports = router;