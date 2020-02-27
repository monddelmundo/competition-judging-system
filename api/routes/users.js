
const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find() //mongoose method that lists the list of users in mongoDB Atlas
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  const newUser = new User({username, password, role});

  newUser.save() //saves new user to DB
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;