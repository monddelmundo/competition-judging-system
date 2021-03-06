
const router = require('express').Router();
let { Event } = require('../models/event.model');
const crypto = require('crypto');

router.route('/').get((req, res) => {
    Event.find() //mongoose method that lists the list of events in mongoDB Atlas
      .then(events => res.json(events))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Event.findById(req.params.id)
    .then(events => res.json(events))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json('Event ' + req.params.id + ' has been deleted!'))
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const category = req.body.category;
  const dateOfEvent = Date.parse(req.body.dateOfEvent);
  const location = req.body.location;
  const participants = req.body.participants;
  const status = req.body.status;
  const accessCode = crypto.randomBytes(3).toString('hex').toUpperCase();

  const newEvent = new Event({
    title, 
    category, 
    dateOfEvent, 
    location, 
    participants, 
    status, 
    accessCode
  });

  newEvent.save() //saves new user to DB
    .then(() => res.json(newEvent))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      event.title = req.body.title;
      event.category = req.body.category;
      event.dateOfEvent = Date.parse(req.body.dateOfEvent);
      event.location = req.body.location;
      event.participants = req.body.participants;
      event.status = req.body.status;
      event.accessCode = req.body.accessCode;

      event.save()
        .then(() => res.json('Event updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;