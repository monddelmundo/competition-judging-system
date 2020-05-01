const router = require("express").Router();
let { Judge } = require("../models/judge.model");
const crypto = require("crypto");

router.route("/").get((req, res) => {
  Judge.find()
    .then((judges) => res.json(judges))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Judge.findById(req.params.id)
    .then((judges) => res.json(judges))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/event_id/:id").get((req, res) => {
  Judge.find({ event_id: req.params.id })
    .then((judges) => res.json(judges))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Judge.findByIdAndDelete(req.params.id)
    .then((judges) => res.json("Judge has been deleted!!!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const event_id = req.body.event_id;
  const firstName = req.body.firstName;
  const middleInitial = req.body.middleInitial;
  const lastName = req.body.lastName;
  const accessCode = crypto.randomBytes(2).toString("hex").toUpperCase();
  const status = req.body.status;
  const scoresheets = req.body.scoresheets;

  const newJudge = new Judge({
    event_id,
    firstName,
    middleInitial,
    lastName,
    accessCode,
    status,
    scoresheets,
  });

  newJudge
    .save()
    .then(() => res.json(newJudge))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Judge.findById(req.params.id)
    .then((judge) => {
      judge.event_id = req.body.event_id;
      judge.firstName = req.body.firstName;
      judge.middleInitial = req.body.middleInitial;
      judge.lastName = req.body.lastName;
      judge.accessCode = req.body.accessCode;
      judge.status = req.body.status;
      judge.scoresheets = req.body.scoresheets;

      judge
        .save()
        .then(() => res.json("Judge updated!!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
