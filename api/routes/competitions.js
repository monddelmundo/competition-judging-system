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
                .then(() => res.json("Competition has been updated!!"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/criteria_id/:criteria_id').get((req, res) => {
    Competition.findById(req.params.id)
        .then(competition => {
            competition.criterias.forEach(criteria => {
                if(criteria._id == req.params.criteria_id) {
                    res.json(criteria);
                }
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id/delete/:criteria_id').delete((req, res) => {
    Competition.findById(req.params.id)
        .then(competition => {
            competition.criterias.forEach(criteria => {
                if(criteria._id == req.params.criteria_id) {
                    competition.criterias.pull(req.params.criteria_id);
                    competition.save()
                        .then(res.json("Criteria has been deleted!!!"))
                        .catch(err => res.status(400).json('Error: ' + err));
                }
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/update/:criteria_id').post((req, res) => {
    Competition.findById(req.params.id)
        .then(competition => {
            let criteria = competition.criterias.find(criteria => criteria._id == req.params.criteria_id)

            criteria.title = req.body.title;
            criteria.value = req.body.value;

            competition.save()
                .then(() => res.json(competition))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/add').post((req, res) => {
    Competition.findById(req.params.id)
        .then(competition => {
            const criteria = {
                title: req.body.title,
                value: req.body.value
            }
            competition.criterias.push(criteria);

            competition.save()
                .then(() => res.json(competition))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;