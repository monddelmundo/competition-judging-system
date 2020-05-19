import React, { useState, useContext, useEffect } from "react";
import { FormGroup, FormLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import {
  addParticipantAction,
  editParticipantAction,
} from "../../context/actions/ChurchActions";
import { loadCompetitionsAction } from "../../context/actions/CompetitionActions";
import DatePicker from "react-datepicker";
import { store } from "../../context/Store";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/TextInput";
import Checkbox from "../../components/Checkbox";

export default function ParticipantForm(props) {
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [dateSaved, setDateSaved] = useState(new Date());
  const [dateBaptized, setDateBaptized] = useState(new Date());
  const [competition_id, setCompetitionID] = useState("");

  const [church, setChurch] = useState("");

  const [enableDateSaved, setEnableDateSaved] = useState(true);
  const [enableDateBaptized, setEnableDateBaptized] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    if (!props.location.state && !props.match.params.id) {
      toast.warn("Please choose a church first before proceeding...");
      props.history.push("/churches");
      return;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);

    try {
      if (props.match.params.id && props.location.state.church) {
        setIsEdit(true);
        const participant = getParticipantById(
          props.match.params.id,
          props.location.state.church
        );

        setFirstName(participant.firstName);
        setMiddleInitial(participant.middleInitial);
        setLastName(participant.lastName);
        setAge(participant.age);
        participant.dateSaved.toString() === "N/A"
          ? setEnableDateSaved(false)
          : setDateSaved(new Date(participant.dateSaved));
        participant.dateBaptized.toString() === "N/A"
          ? setEnableDateBaptized(false)
          : setDateBaptized(new Date(participant.dateBaptized));
        setCompetitionID(participant.competition_id);
      }
    } catch (err) {
      throw err;
    }
  }

  function getParticipantById(id, church) {
    return church.participants.filter(
      (participant) => participant._id == id
    )[0];
  }

  function validateForm() {
    return (
      firstName.length > 0 &&
      middleInitial.length > 0 &&
      lastName.length > 0 &&
      age != 0
    );
  }

  function handleCancel() {
    props.history.push({
      pathname: "/participants",
      state: {
        church: props.location.state.church,
      },
    });
  }

  function toggleSavedChange() {
    setEnableDateSaved(!enableDateSaved);
  }

  function toggleBaptizedChange() {
    setEnableDateBaptized(!enableDateBaptized);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      showDialog(true, "update", (res) => {
        res.then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const updatedParticipant = {
              competition_id,
              firstName,
              middleInitial,
              lastName,
              age,
              dateSaved: enableDateSaved ? dateSaved.toISOString() : "N/A",
              dateBaptized: enableDateBaptized
                ? dateBaptized.toISOString()
                : "N/A",
            };

            editParticipantAction(
              dispatch,
              props.location.state.church._id,
              props.match.params.id,
              updatedParticipant
            )
              .then((res) => {
                toast.success(`Participant was updated successfully!`);
                props.history.push({
                  pathname: "/participants",
                  state: {
                    church: res.data,
                  },
                });
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                toast.error("Error updating this participant. " + err.message);
              });
          }
        });
      });
    } else {
      showDialog(true, "add", (res) => {
        res.then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const newParticipant = {
              competition_id: props.location.state.competition_id,
              firstName,
              middleInitial,
              lastName,
              age,
              dateSaved: enableDateSaved ? dateSaved.toISOString() : "N/A",
              dateBaptized: enableDateBaptized
                ? dateBaptized.toISOString()
                : "N/A",
              maxNoOfPerson: props.location.state.maxNoOfPerson,
            };

            addParticipantAction(
              dispatch,
              props.location.state.church._id,
              newParticipant
            )
              .then((res) => {
                toast.success("New Participant was added successfully!");
                props.history.push({
                  pathname: "/participants",
                  state: {
                    church: res.data,
                  },
                });
              })
              .catch((err) => {
                setIsLoading(false);
                toast.error("Error adding this Church. " + err.message);
              });
          } else throw new Error("Error");
        });
      });
    }
  }

  return isApiInProgress ? (
    <Spinner />
  ) : (
    <div className="participant-form container">
      <AlertDialog />
      <br />
      {isEdit ? <h5>Edit Participant</h5> : <h5>Create Participant</h5>}
      <form onSubmit={handleSubmit}>
        <TextInput
          name="First Name"
          label="First Name"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextInput
          name="Middle Initial"
          label="Middle Initial"
          placeholder="Enter Middle Initial"
          value={middleInitial}
          onChange={(e) => setMiddleInitial(e.target.value)}
        />
        <TextInput
          name="Last Name"
          label="Last Name"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextInput
          name="Age"
          label="Age"
          placeholder="Enter Age"
          value={age.toString()}
          onChange={(e) => setAge(e.target.value)}
        />
        <FormGroup controlId="dateSaved">
          <FormLabel>Date Saved</FormLabel>
          <br />
          <DatePicker
            selected={dateSaved}
            dateFormat="yyyy/MM/dd"
            onChange={(newDate) => setDateSaved(newDate)}
            disabled={!enableDateSaved}
            maxDate={new Date() - 1}
          />
          &nbsp;&nbsp;
          <Checkbox
            name="isNA"
            label="N/A"
            checked={!enableDateSaved}
            onChange={toggleSavedChange}
          />
        </FormGroup>
        <FormGroup controlId="dateBaptized">
          <FormLabel>Date Baptized</FormLabel>
          <br />
          <DatePicker
            selected={dateBaptized}
            dateFormat="yyyy/MM/dd"
            onChange={(newDate) => setDateBaptized(newDate)}
            disabled={!enableDateBaptized}
            maxDate={new Date() - 1}
          />
          &nbsp;&nbsp;
          <Checkbox
            name="isNA"
            label="N/A"
            checked={!enableDateBaptized}
            onChange={toggleBaptizedChange}
          />
        </FormGroup>
        <FormGroup controlId="submit">
          <LoaderButton
            block
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            {isEdit ? "Update" : "Create"}
          </LoaderButton>
        </FormGroup>
      </form>
      <LoaderButton block onClick={handleCancel}>
        Cancel
      </LoaderButton>
    </div>
  );
}
