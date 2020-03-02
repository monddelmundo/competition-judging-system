//const jwt = require('jsonwebtoken');
const router = require('express').Router();
let { User } = require('../models/user.model');
//const secret = process.env.SECRET;

router.route('/').get((req, res) => {
  User.find() //mongoose method that lists the list of users in mongoDB Atlas
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id) 
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id) 
    .then(users => res.json("User has been deleted!!!"))
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

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.username = req.body.username;
      user.password = req.body.password;
      user.role = req.body.role;

      user.save()
        .then(() => res.json("User updated!!"))
        .catch(err => res.status(400).json('Error: ' + err));

  })
      .catch(err => res.status(400).json('Error: ' + err));
});
/*
router.route('/authenticate').post((req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
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
            .sendStatus(200);
        }
      });
    })
})
*/
module.exports = router;