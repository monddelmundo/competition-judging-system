import React, { useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import {
  loadCompetitionsAction,
  editCompetitionAction,
} from "../../context/actions/CompetitionActions";
import Spinner from "../../components/Spinner";

export default function EditCompetition(props) {
  const [eventID, setEventID] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [criterias, setCriterias] = useState([]);
  const [minNoOfPerson, setMinNoOfPerson] = useState(0);
  const [maxNoOfPerson, setMaxNoOfPerson] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.competitions]);

  async function onLoad() {
    try {
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading competitions failed. " + err.message);
      throw err;
    }
    //await axios
    //  .get("http://localhost:5000/competitions/" + props.match.params.id)
    if (state.competitions.length > 0) {
      const comp = getCompetitionById(props.match.params.id);

      setEventID(comp.event_id);
      setName(comp.name);
      setType(comp.type);
      setCriterias(comp.criterias);
      setMinNoOfPerson(comp.minNoOfPerson);
      setMaxNoOfPerson(comp.maxNoOfPerson);
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getCompetitionById(id) {
    return state.competitions.find(
      (competition) => competition._id === props.match.params.id
    );
  }

  function validateForm() {
    return name.length > 0 && minNoOfPerson > 0 && maxNoOfPerson > 0;
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeType(e) {
    setType(e.target.value);
  }

  function onChangeMinNoOfPerson(e) {
    setMinNoOfPerson(e.target.value);
  }

  function onChangeMaxNoOfPerson(e) {
    setMaxNoOfPerson(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    showDialog(true, "update", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const updatedCompetition = {
              event_id: eventID,
              name: name,
              type: type,
              criterias: criterias,
              minNoOfPerson: minNoOfPerson,
              maxNoOfPerson: maxNoOfPerson,
            };

            //updateCompetitionApi(props.match.params.id, updatedCompetition)
            editCompetitionAction(
              dispatch,
              props.match.params.id,
              updatedCompetition
            )
              .then(() => {
                toast.success(`Competition was updated successfully!`);

                props.history.push("/competitions");
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                toast.error("Error updating this competition.");
              });

            // props.history.push("/competitions");
            // window.location.reload();
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Unexpected error!");
        });
    });
  }

  function handleCancel() {
    props.history.push("/competitions");
  }

  return (
    <div className="edit-competition container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <>
          <br />
          <h5>Edit Competition</h5>
          <form onSubmit={handleSubmit}>
            <FormGroup controlId="name">
              <FormLabel>Name</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={name}
                onChange={onChangeName}
              />
            </FormGroup>
            <FormGroup controlId="type">
              <FormLabel>Type</FormLabel>
              <FormControl as="select" value={type} onChange={onChangeType}>
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
                value={minNoOfPerson}
                onChange={onChangeMinNoOfPerson}
              />
            </FormGroup>
            <FormGroup controlId="maxNoOfPerson">
              <FormLabel>Max # of Person</FormLabel>
              <FormControl
                type="text"
                value={maxNoOfPerson}
                onChange={onChangeMaxNoOfPerson}
              />
            </FormGroup>
            <FormGroup controlId="loaderBtn">
              <LoaderButton
                block
                type="submit"
                isLoading={isLoading}
                disabled={!validateForm()}
              >
                Update
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
