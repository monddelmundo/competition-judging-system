const router = require('express').Router();
let { Church } = require('../models/church.model');

router.route('/').get((req, res) => {
    Church.find() 
      .then(churches => res.json(churches))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getIDNumberName/').get((req, res) => {
    Church.find()
        .select('_id churchNumber name acronym')
        .exec(function(err, churches) {
            (err) ? res.status(400).json('Error ' + err)
            : res.json(churches)
        });
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
    const churchNumber = req.body.churchNumber;
    const acronym = req.body.acronym;
    const participants = req.body.participants;

    const newChurch = new Church ({
        event_id,
        name,
        churchNumber,
        acronym,
        participants
    });

    newChurch.save()
        .then(() => res.json("Church added!!!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Church.findById(req.params.id)
        .then(churches => {
            churches.event_id = req.body.event_id;
            churches.name = req.body.name;
            churches.churchNumber = req.body.churchNumber;
            churches.acronym = req.body.acronym;
            churches.participants = req.body.participants

            churches.save()
                .then(() => res.json("Church updated!!"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
