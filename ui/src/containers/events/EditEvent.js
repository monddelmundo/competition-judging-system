import React, { useEffect, useState, useContext } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import LoaderButton from "../../components/LoaderButton";
import "react-datepicker/dist/react-datepicker.css";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import {
  loadEventsAction,
  editEventAction,
} from "../../context/actions/EventActions";
import Spinner from "../../components/Spinner";

export default function EditEvent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateOfEvent, setDateOfEvent] = useState(new Date());
  const [status, setStatus] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.events]);

  async function onLoad() {
    // axios
    //   .get("http://localhost:5000/events/" + props.match.params.id)
    try {
      if (state.events.length === 0) {
        await loadEventsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading events failed. " + err.message);
      throw err;
    }

    if (state.events.length > 0) {
      const event = getEventById(props.match.params.id);
      setTitle(event.title);
      setCategory(event.category);
      setDateOfEvent(new Date(event.dateOfEvent));
      setLocation(event.location);
      setParticipants(event.participants);
      setStatus(event.status);
      setAccessCode(event.accessCode);
    }
    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getEventById(id) {
    return state.events.find((event) => event._id === props.match.params.id);
  }

  function validateForm() {
    return (
      title.length > 0 &&
      category.length > 0 &&
      location.length > 0 &&
      participants.length > 0
    );
  }

  function onChangeTitle(e) {
    setTitle(e.target.value);
  }

  function onChangeCategory(e) {
    setCategory(e.target.value);
  }

  function onChangeLocation(e) {
    setLocation(e.target.value);
  }

  function onChangeParticipants(e) {
    setParticipants(e.target.value);
  }

  function handleCancel() {
    props.history.push("/events");
  }

  function handleSubmit(e) {
    e.preventDefault();
    showDialog(true, "update", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            setIsLoading(true);

            const updatedEvent = {
              title,
              category,
              dateOfEvent,
              location,
              participants,
              status,
              accessCode,
            };

            // axios
            //   .post(
            //     "http://localhost:5000/events/update/" + props.match.params.id,
            //     updatedEvent
            //   )
            //updateEventApi(props.match.params.id, updatedEvent)
            editEventAction(dispatch, props.match.params.id, updatedEvent)
              .then(() => {
                toast.success(`Event was updated successfully!`);
                props.history.push("/events");
                //window.location.reload();
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                toast.error("Error updating this event. " + err.message);
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Unexpected error! " + err.message);
        });
    });
  }

  return (
    <div className="edit-event container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <>
          <br />
          <h5>Edit Event</h5>
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
            <FormGroup controlId="category">
              <FormLabel>Category</FormLabel>
              <FormControl
                as="select"
                value={category}
                onChange={onChangeCategory}
              >
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
                minDate={new Date()}
                showDisabledMonthNavigation
              />
            </FormGroup>
            <FormGroup controlId="location">
              <FormLabel>Location</FormLabel>
              <FormControl
                type="text"
                value={location}
                onChange={onChangeLocation}
              />
            </FormGroup>
            <FormGroup controlId="participants">
              <FormLabel>Participants</FormLabel>
              <FormControl
                as="select"
                value={participants}
                onChange={onChangeParticipants}
              >
                <option value="youth">Youth</option>
                <option value="adult">Adult</option>
              </FormControl>
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
