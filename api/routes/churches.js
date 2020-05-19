const router = require("express").Router();
let { Church } = require("../models/church.model");

router.route("/").get((req, res) => {
  Church.find()
    .then((churches) => res.json(churches))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/getIDNumberName/").get((req, res) => {
  Church.find()
    .select("_id churchNumber name acronym")
    .exec(function (err, churches) {
      err ? res.status(400).json("Error " + err) : res.json(churches);
    });
});

router.route("/:id").get((req, res) => {
  Church.findById(req.params.id)
    .then((churches) => res.json(churches))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Church.findByIdAndDelete(req.params.id)
    .then((churches) => res.json("Church has been deleted!!!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const event_id = req.body.event_id;
  const name = req.body.name;
  const churchNumber = req.body.churchNumber;
  const acronym = req.body.acronym;
  const participants = req.body.participants;

  const newChurch = new Church({
    event_id,
    name,
    churchNumber,
    acronym,
    participants,
  });

  newChurch
    .save()
    .then(() => res.json(newChurch))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id/add").post((req, res) => {
  const competition_id = req.body.competition_id;
  const firstName = req.body.firstName;
  const middleInitial = req.body.middleInitial;
  const lastName = req.body.lastName;
  const age = req.body.age;
  const dateSaved = req.body.dateSaved;
  const dateBaptized = req.body.dateBaptized;
  const maxNoOfPerson = req.body.maxNoOfPerson;

  const newParticipant = {
    competition_id,
    firstName,
    middleInitial,
    lastName,
    age,
    dateSaved,
    dateBaptized,
  };

  Church.findById(req.params.id)
    .then((church) => {
      const filteredParticipants = church.participants.filter(
        (participant) => participant.competition_id == competition_id
      );

      if (filteredParticipants.length < maxNoOfPerson) {
        church.participants.push(newParticipant);

        church
          .save()
          .then(() => res.json(church))
          .catch((err) => res.status(400).json("Error: " + err));
      } else {
        res
          .status(400)
          .json(
            "Error: You cannot add any more participants to this competition!"
          );
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id/delete/:participant_id").delete((req, res) => {
  Church.findById(req.params.id)
    .then((church) => {
      church.participants.forEach((participants) => {
        if (participants._id == req.params.participant_id) {
          church.participants.pull(req.params.participant_id);
          church
            .save()
            .then(res.json("Participant has been deleted!!!"))
            .catch((err) => res.status(400).json("Error: " + err));
        }
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id/update/:participant_id").post((req, res) => {
  Church.findById(req.params.id)
    .then((church) => {
      let participant = church.participants.find(
        (participant) => participant._id == req.params.participant_id
      );

      participant.firstName = req.body.firstName;
      participant.middleInitial = req.body.middleInitial;
      participant.lastName = req.body.lastName;
      participant.age = req.body.age;
      participant.dateSaved = req.body.dateSaved;
      participant.dateBaptized = req.body.dateBaptized;
      participant.competition_id = req.body.competition_id;

      church
        .save()
        .then(() => res.json(church))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Church.findById(req.params.id)
    .then((churches) => {
      churches.event_id = req.body.event_id;
      churches.name = req.body.name;
      churches.churchNumber = req.body.churchNumber;
      churches.acronym = req.body.acronym;
      churches.participants = req.body.participants;

      churches
        .save()
        .then(() => res.json("Church updated!!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/rndChurchNumber").post((req, res) => {
  Church.find({ event_id: req.body.event_id }).then((churches) => {
    let usedNumbers = [];

    churches.map((church) => {
      if (church.churchNumber !== 0) {
        usedNumbers.push(church.churchNumber);
      }
    });

    churches.map((church) => {
      if (church.churchNumber === 0) {
        const rndmize = (ln) => Math.floor(Math.random() * ln) + 1;
        let num = rndmize(churches.length);

        while (usedNumbers.includes(num)) {
          num = rndmize(churches.length);
        }

        church.churchNumber = num;
        usedNumbers.push(num);

        church.save().catch((err) => res.status(400).json("Error: " + err));
      }
    });
    res.json("Church numbers have been updated!");
  });
});

module.exports = router;
