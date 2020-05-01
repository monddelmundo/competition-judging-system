import React, { useState, useContext, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import {
  loadEventsAction,
  addEventAction,
} from "../../context/actions/EventActions";
import { store } from "../../context/Store";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

export default function CreateEvent(props) {
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    category: "",
    location: "",
    participants: "",
  });

  const [dateOfEvent, setDateOfEvent] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.events]);

  async function onLoad() {
    try {
      if (state.events.length === 0) {
        await loadEventsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading events failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function validateForm() {
    return (
      fields.title.length > 0 &&
      fields.category !== "" &&
      fields.participants !== "" &&
      fields.location.length > 0
    );
  }

  function handleCancel() {
    props.history.push("/events");
  }

  function handleSubmit(e) {
    e.preventDefault();
    showDialog(true, "add", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const newEvent = {
              title: fields.title,
              category: fields.category,
              dateOfEvent,
              location: fields.location,
              participants: fields.participants,
              status: "inpr",
            };
            //axios
            //  .post("http://localhost:5000/events/add", newEvent)
            //createEventApi(newEvent)
            addEventAction(dispatch, newEvent)
              .then(() => {
                toast.success("New event was added successfully!");
                //notify(`New event was added successfully!`, "success");
                //console.log(res);
                props.history.push("/events");
              })
              .catch((err) => {
                setIsLoading(false);
                //console.error(err);
                toast.error("Error adding this event. " + err.message);
                //notify("Error adding this event.", "error");
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Unexpected error! " + err.message);
          //notify("Unexpected error!", "error");
        });
    });
  }

  return (
    <div className="create-event container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <>
          <br />
          <h5>Create Event</h5>
          <form onSubmit={handleSubmit}>
            <FormGroup controlId="title">
              <FormLabel>Title</FormLabel>
              <FormControl
                autoFocus
                type="text"
                placeholder="Enter Title"
                value={fields.title}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="category">
              <FormLabel>Category</FormLabel>
              <FormControl
                as="select"
                placeholder="Category"
                value={fields.category}
                onChange={handleFieldChange}
              >
                <option value="">Select Category</option>
                <option value="regional">Regional</option>
                <option value="national">National</option>
              </FormControl>
            </FormGroup>
            <FormGroup controlId="dateOfEvent">
              <FormLabel>Date of Event</FormLabel>
              <br />
              <DatePicker
                selected={dateOfEvent}
                onChange={(newDate) => setDateOfEvent(newDate)}
              />
            </FormGroup>
            <FormGroup controlId="location">
              <FormLabel>Location</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Location"
                value={fields.location}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="participants">
              <FormLabel>Participants</FormLabel>
              <FormControl
                as="select"
                placeholder="Participants"
                value={fields.participants}
                onChange={handleFieldChange}
              >
                <option value="">Select Participants</option>
                <option value="youth">Youth</option>
                <option value="adult">Adult</option>
              </FormControl>
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
