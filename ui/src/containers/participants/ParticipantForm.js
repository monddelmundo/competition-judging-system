import React, { useState, useContext, useEffect } from "react";
import { FormGroup, FormLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import {
  addJudgeAction,
  editJudgeAction,
  loadJudgesAction,
} from "../../context/actions/JudgeActions";
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
        : setDateSaved(participant.dateSaved);
      participant.dateSaved.toString() === "N/A"
        ? setEnableDateBaptized(false)
        : setDateBaptized(participant.dateBaptized);
      setCompetitionID(participant.competition_id);
    } else {
      console.log("Competition:", props.location.state.competition_id);
      console.log("Church:", props.location.state.church._id);
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

  function handleSubmit(e) {}

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
            onChange={(newDate) => setDateSaved(newDate)}
            disabled={!enableDateSaved}
          />
          &nbsp;&nbsp;
          <Checkbox
            name="isNA"
            label="N/A"
            checked={!enableDateSaved}
            onChange={toggleSavedChange}
          />
        </FormGroup>
        <FormGroup controlId="dateSaved">
          <FormLabel>Date Baptized</FormLabel>
          <br />
          <DatePicker
            selected={dateBaptized}
            onChange={(newDate) => setDateBaptized(newDate)}
            disabled={!enableDateBaptized}
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
