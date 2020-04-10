import React, { useEffect, useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import LoaderButton from "../../components/LoaderButton";
import "react-datepicker/dist/react-datepicker.css";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { notify } from "../../components/notifications/Notification";
import { getEventApi, updateEventApi } from "../../api/EventApi";

export default function EditEvent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateOfEvent, setDateOfEvent] = useState(new Date());
  const [status, setStatus] = useState("");
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    // axios
    //   .get("http://localhost:5000/events/" + props.match.params.id)
    getEventApi(props.match.params.id)
      .then((res) => {
        setTitle(res.data.title);
        setCategory(res.data.category);
        setDateOfEvent(new Date(res.data.dateOfEvent));
        setLocation(res.data.location);
        setParticipants(res.data.participants);
        setStatus(res.data.status);
        setAccessCode(res.data.accessCode);
      })
      .catch(function (error) {
        console.log(error);
      });
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
              title: title,
              category: category,
              dateOfEvent: dateOfEvent,
              location: location,
              participants: participants,
              status: status,
              accessCode: accessCode,
            };

            // axios
            //   .post(
            //     "http://localhost:5000/events/update/" + props.match.params.id,
            //     updatedEvent
            //   )
            updateEventApi(props.match.params.id, updatedEvent)
              .then((res) => {
                notify(`Event was updated successfully!`, "success");
                console.log(res.data);
                props.history.push("/events");
                //window.location.reload();
              })
              .catch((err) => {
                setIsLoading(false);
                console.error(err);
                notify("Error updating this event.", "error");
              });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          notify("Unexpected error!", "error");
        });
    });
  }

  return (
    <div className="edit-event container">
      <AlertDialog />
      <h3>Edit Event</h3>
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
          <FormControl as="select" value={category} onChange={onChangeCategory}>
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
    </div>
  );
}
