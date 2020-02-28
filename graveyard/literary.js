
const router = require('express').Router();
let { Literary } = require('../models/literary.model');
let { Event } = require('../models/event.model');
let { Judge } = require('../models/judge.model');
let { Scoresheet } = require('../models/scoresheet.model');

router.route('/:id').get((req, res) => {
    Event.findOne({'judges.scoresheet.literary' : { $elemMatch: { _id: req.params.id } }}) 
        .then(event => {
            event.judges.forEach(judges => {
                const scoresheet = judges.scoresheet;
                scoresheet.forEach(scores => {
                    const literary = scores.literary;
                    literary.forEach(entry => {
                        if(entry._id == req.params.id)
                            res.json(entry);
                    })
                })
                
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));    
});

router.route('/add').post((req, res) => {
    
    //todo
});

router.route('/update/:id').post((req, res) => {
    Event.findOne({'judges.scoresheet.literary' : { $elemMatch: { _id: req.params.id } }}) 
        .then(event => {
            event.judges.forEach(judges => {
                const scoresheet = judges.scoresheet;
                scoresheet.forEach(scores => {
                    const literary = scores.literary;
                    literary.forEach(entry => {
                        if(entry._id == req.params.id)
                            entry.name = req.body.name;
                            entry.criterias = req.body.criterias;
                            //res.json(entry);
                    })
                })
            });

            event.save()
                .then(() => res.json('Entry updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));    

    
});
      

module.exports = router;