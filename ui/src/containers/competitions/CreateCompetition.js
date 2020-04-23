import React, { useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { notify } from "../../components/notifications/Notification";
import {
  loadCompetitionsAction,
  addCompetitionAction,
} from "../../context/actions/CompetitionActions";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import Spinner from "../../components/Spinner";

export default function CreateCompetition(props) {
  const [isLoading, setIsLoading] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    type: "",
    criterias: [],
    minNoOfPerson: 0,
    maxNoOfPerson: 0,
  });
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.competitions]);

  async function onLoad() {
    if (!props.location.state) {
      toast.warn(
        "Please choose an event first before creating a competition..."
      );
      props.history.push("/competitions");
      return;
    }

    try {
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading competitions failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function validateForm() {
    return (
      fields.name.length > 0 &&
      fields.type != "" &&
      fields.minNoOfPerson > 0 &&
      fields.maxNoOfPerson > 0
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    showDialog(true, "add", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const newCompetition = {
              event_id: props.location.state.eventID,
              name: fields.name,
              type: fields.type,
              criterias: fields.criterias,
              minNoOfPerson: fields.minNoOfPerson,
              maxNoOfPerson: fields.maxNoOfPerson,
            };

            addCompetitionAction(dispatch, newCompetition)
              .then((res) => {
                toast.success(`New competition was added successfully!`);

                props.history.push({
                  pathname: "/competitions",
                  // state: {
                  //   competition: res.data,
                  // },
                });
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                toast.error("Error adding this competition.");
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          notify("Unexpected error!", "error");
        });
    });
  }

  function handleCancel() {
    props.history.push("/competitions");
  }

  return (
    <div className="create-competition container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <>
          <h3>Create Competition</h3>
          <form onSubmit={handleSubmit}>
            <FormGroup controlId="name">
              <FormLabel>Name</FormLabel>
              <FormControl
                autoFocus
                type="text"
                placeholder="Enter Name"
                value={fields.name}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="type">
              <FormLabel>Type</FormLabel>
              <FormControl
                as="select"
                value={fields.type}
                onChange={handleFieldChange}
              >
                <option key="" value="">
                  Select Type
                </option>
                <option key="musical" value="musical">
                  Musical
                </option>
                <option key="literary" value="literary">
                  Literary
                </option>
              </FormControl>
            </FormGroup>
            <FormGroup controlId="minNoOfPerson">
              <FormLabel>Min. # of Person</FormLabel>
              <FormControl
                type="text"
                value={fields.minNoOfPerson}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="maxNoOfPerson">
              <FormLabel>Max # of Person</FormLabel>
              <FormControl
                type="text"
                value={fields.maxNoOfPerson}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="submit">
              <LoaderButton
                block
                type="submit"
                isLoading={isLoading}
                disabled={!validateForm()}
              >
                Create
              </LoaderButton>
            </FormGroup>
          </form>
          <LoaderButton block onClick={handleCancel}>
            Cancel
          </LoaderButton>
        </>
      )}
    </div>
  );
}
