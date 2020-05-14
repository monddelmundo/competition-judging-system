import React, { useState, useContext, useEffect } from "react";
import { FormGroup } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import {
  addChurchAction,
  editChurchAction,
  loadChurchesAction,
} from "../../context/actions/ChurchActions";
import { store } from "../../context/Store";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/TextInput";

export default function ChurchForm(props) {
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [churchNumber, setChurchNumber] = useState("");
  const [participants, setParticipants] = useState("");
  const [event_id, setEventId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.churches]);

  async function onLoad() {
    if (!props.location.state && !props.match.params.id) {
      toast.warn("Please choose an event first before proceeding...");
      props.history.push("/churches");
      return;
    }

    try {
      if (state.churches.length === 0) {
        await loadChurchesAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading churches failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);

    if (props.match.params.id && state.churches.length > 0) {
      setIsEdit(true);
      const church = getChurchesById(props.match.params.id);

      setName(church.name);
      setAcronym(church.acronym);
      setChurchNumber(church.churchNumber);
      setParticipants(church.participants);
      setEventId(church.event_id);
    }
  }

  function getChurchesById(id) {
    return state.churches.find((church) => church._id === id);
  }

  function validateForm() {
    return name.length > 0 && acronym.length > 0;
  }

  function handleCancel() {
    props.history.push("/churches");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      showDialog(true, "update", (res) => {
        res
          .then((proceed) => {
            if (proceed) {
              setIsLoading(true);

              const updatedChurch = {
                event_id,
                name,
                churchNumber,
                participants,
                acronym,
              };

              editChurchAction(dispatch, props.match.params.id, updatedChurch)
                .then(() => {
                  toast.success(`Church was updated successfully!`);
                  props.history.push("/churches");
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.error(err);
                  toast.error("Error updating this church. " + err.message);
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

              const newChurch = {
                event_id: props.location.state.eventID,
                name,
                churchNumber: 0,
                participants: [],
                acronym,
              };

              addChurchAction(dispatch, newChurch)
                .then(() => {
                  toast.success("New Church was added successfully!");
                  props.history.push("/churches");
                })
                .catch((err) => {
                  setIsLoading(false);
                  toast.error("Error adding this Church. " + err.message);
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
    <div className="church-form container">
      <AlertDialog />
      <br />
      {isEdit ? <h5>Edit Church</h5> : <h5>Create Church</h5>}
      <form onSubmit={handleSubmit}>
        <TextInput
          name="Name"
          label="Name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          name="Acronym"
          label="Acronym"
          placeholder="Enter Acronym"
          value={acronym}
          onChange={(e) => setAcronym(e.target.value)}
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
