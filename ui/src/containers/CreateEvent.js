import React, { useState } from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import axios from "axios";

export default function CreateEvent(props) {
    const [fields, handleFieldChange] = useFormFields({
        title: "",
        category: "",
        location: "",
        participants: ""
    });

    const [dateOfEvent, setDateOfEvent] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return fields.title.length > 0 && fields.location.length > 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        
        const newEvent = {
            title: fields.title,
            category: fields.category,
            dateOfEvent: dateOfEvent,
            location: fields.location,
            participants: fields.participants,
            status: "inpr"
        }

        //console.log(newEvent);
        axios.post('http://localhost:5000/events/add', newEvent)
            .then(res => console.log(res.data))
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                alert('Error adding this event.');
            });
            
        props.history.push('/events');
        window.location.reload();
        
    }

    return (
        <div className="create-event">
            <h3>Create Event</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="title" bsSize="large">
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.title}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="category" bsSize="large">
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                        componentClass="select"
                        placeholder="Category"
                        value={fields.category || "Regional"}
                        onChange={handleFieldChange}
                    >
                        <option value="regional">Regional</option>
                        <option value="national">National</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="dateOfEvent" bsSize="large">
                    <ControlLabel>Date of Event</ControlLabel>
                    <br />
                    <DatePicker
                        selected={dateOfEvent}
                        onChange={(newDate) => setDateOfEvent(newDate)}
                    />
                </FormGroup>
                <FormGroup controlId="location" bsSize="large">
                    <ControlLabel>Location</ControlLabel>
                    <FormControl
                        type="text"
                        value={fields.location}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="participants" bsSize="large">
                    <ControlLabel>Participants</ControlLabel>
                    <FormControl
                        componentClass="select"
                        placeholder="Participants"
                        value={fields.participants || "Adult"}
                        onChange={handleFieldChange}
                    >
                        <option value="youth">Youth</option>
                        <option value="adult">Adult</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="submit">
                    <LoaderButton
                        block
                        type="submit"
                        bsSize="large"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Create
                    </LoaderButton>
                </FormGroup>
            </form>
        </div>
    );

}