import React, { useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { addCriteriaAction } from "../../context/actions/CompetitionActions";

export default function CreateCriteria(props) {
  const [competition, setCompetition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    value: 0,
  });
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, []);

  function onLoad() {
    setCompetition(props.location.state.competition);
  }

  function validateForm() {
    return fields.title.length > 0 && fields.value > 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    showDialog(true, "add", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            // axios
            //   .post(
            //     "http://localhost:5000/competitions/" +
            //       props.location.state.competition._id +
            //       "/add",
            //     fields
            //   )
            //createCriteriaApi(props.location.state.competition._id, fields)
            addCriteriaAction(
              dispatch,
              props.location.state.competition._id,
              fields
            )
              .then((res) => {
                toast.success(`New criteria was added successfully!`);

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
                toast.error("Error adding this criteria.");
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Unexpected error!");
        });
    });
  }

  function handleCancel() {
    props.history.push({
      pathname: "/criterias",
      state: {
        competition: competition,
      },
    });
  }

  return (
    <div className="create-criteria container">
      <AlertDialog />
      <br />
      <h5>Create Criteria</h5>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title">
          <FormLabel>Title</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.title}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="value">
          <FormLabel>Percentage (%)</FormLabel>
          <FormControl
            type="text"
            value={fields.value}
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
    </div>
  );
}
