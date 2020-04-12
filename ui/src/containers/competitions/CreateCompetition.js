import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import axios from "axios";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { notify } from "../../components/notifications/Notification";
import { createCompetitionApi } from "../../api/CompetitionApi";

export default function CreateCompetition(props) {
  const [isLoading, setIsLoading] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    type: "",
    criterias: [],
    minNoOfPerson: 0,
    maxNoOfPerson: 0,
  });

  useEffect(() => {
    onLoad();
  }, []);

  function onLoad() {}

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

            //axios
            //  .post("http://localhost:5000/competitions/add", newCompetition)
            createCompetitionApi(newCompetition)
              .then((res) => {
                notify(`New competition was added successfully!`, "success");

                props.history.push({
                  pathname: "/criterias/add",
                  state: {
                    competition: res.data,
                  },
                });
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                notify("Error adding this competition.", "error");
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
    </div>
  );
}
