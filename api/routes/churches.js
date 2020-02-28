const router = require('express').Router();
let { Church } = require('../models/church.model');

router.route('/').get((req, res) => {
    Church.find() 
      .then(churches => res.json(churches))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Church.findById(req.params.id) 
      .then(churches => res.json(churches))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Church.findByIdAndDelete(req.params.id) 
      .then(churches => res.json("Church has been deleted!!!"))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const event_id = req.body.event_id;
    const name = req.body.name;
    const number = req.body.number;

    const newChurch = new Church ({
        event_id,
        name,
        number
        //todo
        //add participants
    });

    newChurch.save()
        .then(() => res.json("Church added!!!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
