import React, { useEffect, useState } from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import LoaderButton from "../components/LoaderButton";
import "react-datepicker/dist/react-datepicker.css";

export default function EditEvent(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [participants, setParticipants] = useState('');
    const [dateOfEvent, setDateOfEvent] = useState(new Date());
    const [status, setStatus] = useState('');
    const [accessCode, setAccessCode] = useState('');

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        axios.get('http://localhost:5000/events/' + props.match.params.id)
            .then(res => {
                
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
            })
    }

    function validateForm() {
        return title.length > 0 && category.length > 0 && location.length > 0 && participants.length > 0;
    }

    function onChangeTitle(e) {
        setTitle(e.target.value);
    }

    function onChangeCategory(e) {
        setCategory(e.target.value);
    }

    function onChangeDateOfEvent(e) {
        setDateOfEvent(e.target.value);
    }

    function onChangeLocation(e) {
        setLocation(e.target.value);
    }

    function onChangeParticipants(e) {
        setParticipants(e.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        
        const updateEvent = {
            title: title,
            category: category,
            dateOfEvent: dateOfEvent,
            location: location,
            participants: participants,
            status: status,
            accessCode: accessCode
        }

        axios.post('http://localhost:5000/events/update/' + props.match.params.id, updateEvent)
            .then(res => console.log(res.data))
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                alert('Error updating this event.');
            });

        props.history.push('/events');
        window.location.reload();
    }

    return (
        <div>
            <h3>Edit Event</h3>
            <form onSubmit={onSubmit}>
                <FormGroup controlId="title" bsSize="large">
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={title}
                        onChange={onChangeTitle}
                    />
                </FormGroup>
                <FormGroup controlId="category" bsSize="large">
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                        componentClass="select"
                        value={category}
                        onChange={onChangeCategory}
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
                        value={location}
                        onChange={onChangeLocation}
                    />
                </FormGroup>
                <FormGroup controlId="participants" bsSize="large">
                    <ControlLabel>Participants</ControlLabel>
                    <FormControl
                        componentClass="select"
                        value={participants}
                        onChange={onChangeParticipants}
                    >
                        <option value="youth">Youth</option>
                        <option value="adult">Adult</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="loaderBtn" bsSize="large">
                    <LoaderButton
                        block
                        type="submit"
                        bsSize="large"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Update
                    </LoaderButton>
                </FormGroup>
            </form>
        </div>
    );
}