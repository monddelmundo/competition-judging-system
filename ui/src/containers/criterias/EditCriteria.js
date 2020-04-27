import React, { useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { editCriteriaAction } from "../../context/actions/CompetitionActions";

export default function EditCriteria(props) {
  const [competition, setCompetition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(0);
  const { dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, []);

  function onLoad() {
    try {
      const localCompetition = props.location.state.competition;
      const criteria = getCriteriaById(localCompetition, props.match.params.id);
      setCompetition(localCompetition);

      setTitle(criteria.title);
      setValue(parseInt(criteria.value));
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }
  }

  function getCriteriaById(localCompetition, id) {
    return localCompetition.criterias.find((criteria) => criteria._id === id);
  }

  function validateForm() {
    return title.length > 0 && value > 0;
  }

  function onChangeTitle(e) {
    setTitle(e.target.value);
  }

  function onChangeValue(e) {
    setValue(e.target.value);
  }

  function handleCancel() {
    props.history.push({
      pathname: "/criterias",
      state: {
        competition: competition,
      },
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    showDialog(true, "update", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const updatedCriteria = {
              title: title,
              value: value,
            };
            editCriteriaAction(
              dispatch,
              competition._id,
              props.match.params.id,
              updatedCriteria
            )
              .then((res) => {
                toast.success(`Criteria was updated successfully!`);

                props.history.push({
                  pathname: "/criterias",
                  state: {
                    competition: res.data,
                  },
                });
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                toast.error("Error updating this criteria.");
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Unexpected error!");
        });
    });
  }

  return (
    <div className="edit-criteria container">
      <AlertDialog />
      <br />
      <h5>Edit Criteria</h5>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title">
          <FormLabel>Title</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={title}
            onChange={onChangeTitle}
          />
        </FormGroup>
        <FormGroup controlId="value">
          <FormLabel>Percentage (%)</FormLabel>
          <FormControl type="text" value={value} onChange={onChangeValue} />
        </FormGroup>
        <FormGroup controlId="submit">
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
    </div>
  );
}
