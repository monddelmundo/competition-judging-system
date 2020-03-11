const router = require('express').Router();
let { Competition } = require('../models/competition.model');

router.route('/').get((req, res) => {
    Competition.find() 
      .then(competitions => res.json(competitions))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Competition.findById(req.params.id) 
      .then(competitions => res.json(competitions))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/event_id/:id').get((req, res) => {
    Competition.find({ event_id: req.params.id })
        .then(competitions => res.json(competitions))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res) => {
    Competition.findByIdAndDelete(req.params.id) 
      .then(competitions => res.json("Competition has been deleted!!!"))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const event_id = req.body.event_id;
    const name = req.body.name;
    const type = req.body.type;
    const criterias = req.body.criterias;
    const minNoOfPerson = req.body.minNoOfPerson;
    const maxNoOfPerson = req.body.maxNoOfPerson;

    const newCompetition = new Competition ({
        event_id,
        name,
        type,
        criterias,
        minNoOfPerson,
        maxNoOfPerson
    });

    newCompetition.save()
        .then(() => res.json("Competition added!!!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Competition.findById(req.params.id)
        .then(competitions => {
            competitions.event_id = req.body.event_id;
            competitions.name = req.body.name;
            competitions.type = req.body.type;
            competitions.criterias = req.body.criterias;
            competitions.minNoOfPerson = req.body.minNoOfPerson;
            competitions.maxNoOfPerson = req.body.maxNoOfPerson;

            competitions.save()
                .then(() => res.json("Competition updated!!"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;