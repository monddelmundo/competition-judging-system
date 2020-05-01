import React, { useState, useContext, useEffect } from "react";
import { FormGroup } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import {
  addJudgeAction,
  editJudgeAction,
  loadJudgesAction,
} from "../../context/actions/JudgeActions";
import { store } from "../../context/Store";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";

export default function JudgeForm(props) {
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [scoresheets, setScoresheets] = useState("");
  const [event_id, setEventId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.judges]);

  async function onLoad() {
    if (!props.location.state && !props.match.params.id) {
      toast.warn("Please choose an event first before proceeding...");
      props.history.push("/judges");
      return;
    }

    try {
      if (state.judges.length === 0) {
        await loadJudgesAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading judges failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);

    if (props.match.params.id && state.judges.length > 0) {
      setIsEdit(true);
      const judge = getJudgeById(props.match.params.id);

      setFirstName(judge.firstName);
      setMiddleInitial(judge.middleInitial);
      setLastName(judge.lastName);
      setStatus(judge.status);
      setAccessCode(judge.accessCode);
      setScoresheets(judge.scoresheets);
      setEventId(judge.event_id);
    }
  }

  function getJudgeById(id) {
    return state.judges.find((judge) => judge._id === id);
  }

  function validateForm() {
    return (
      firstName.length > 0 && middleInitial.length > 0 && lastName.length > 0
    );
  }

  function handleCancel() {
    props.history.push("/judges");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      showDialog(true, "update", (res) => {
        res
          .then((proceed) => {
            if (proceed) {
              setIsLoading(true);

              const updatedJudge = {
                event_id,
                firstName,
                middleInitial,
                lastName,
                status,
                accessCode,
                scoresheets,
              };

              editJudgeAction(dispatch, props.match.params.id, updatedJudge)
                .then(() => {
                  toast.success(`Judge was updated successfully!`);
                  props.history.push("/judges");
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.error(err);
                  toast.error("Error updating this judge. " + err.message);
                });
            } else throw new Error("Error");
          })
          .catch((err) => {
            console.error(err);
            toast.error("Unexpected error! " + err.message);
          });
      });
    } else {
      showDialog(true, "add", (res) => {
        res
          .then((proceed) => {
            if (proceed) {
              setIsLoading(true);

              const newJudge = {
                event_id: props.location.state.eventID,
                firstName,
                middleInitial,
                lastName,
                status: "Incomplete",
                scoresheets: [],
              };

              addJudgeAction(dispatch, newJudge)
                .then(() => {
                  toast.success("New Judge was added successfully!");
                  props.history.push("/judges");
                })
                .catch((err) => {
                  setIsLoading(false);
                  toast.error("Error adding this Judge. " + err.message);
                });
            } else throw new Error("Error");
          })
          .catch((err) => {
            console.error(err);
            toast.error("Unexpected error! " + err.message);
          });
      });
    }
  }

  return isApiInProgress ? (
    <Spinner />
  ) : (
    <div className="judge-form container">
      <AlertDialog />
      <br />
      {isEdit ? <h5>Edit Judge</h5> : <h5>Create Judge</h5>}
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
