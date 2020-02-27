
const router = require('express').Router();
let { Musical } = require('../models/musical.model');

router.route('/').get((req, res) => {
    Musical.find() //mongoose method that lists the list of musical in mongoDB Atlas
      .then(musical => res.json(musical))
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;