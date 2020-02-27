
const router = require('express').Router();
let { Event } = require('../models/event.model');

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
    .then(() => res.json('Exercise ' + req.params.id + ' has been deleted!'))
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const category = req.body.category;
  const dateOfEvent = Date(req.body.dateOfEvent);
  const location = req.body.location;
  const participants = req.body.participants;
  const status = req.body.status;
  const accessCode = req.body.accessCode;
  const competitions = req.body.competitions;
  const judges = req.body.judges;
  const churches = req.body.churches;
  const scoresheets = req.body.scoresheets;

  const newEvent = new Event({
    title, 
    category, 
    dateOfEvent, 
    location, 
    participants, 
    status, 
    accessCode,
    competitions,
    judges,
    churches,
    scoresheets
  });

  newEvent.save() //saves new user to DB
    .then(() => res.json('Event added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      event.title = req.body.title;
      event.category = req.body.category;
      event.dateOfEvent = Date(req.body.dateOfEvent);
      event.location = req.body.location;
      event.participants = req.body.participants;
      event.status = req.body.status;
      event.accessCode = req.body.accessCode;
      event.competitions = req.body.competitions;
      event.judges = req.body.judges;
      event.churches = req.body.churches;
      event.scoresheets = req.body.scoresheets;

      event.save()
        .then(() => res.json('Event updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;