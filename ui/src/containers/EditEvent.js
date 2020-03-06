import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormFields } from "../libs/hooksLib";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function EditEvent(props) {

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
            .then(res => console.log(res.data));
        
        props.history.push('/events');
    }

    return (
        <div>
            <h3>Edit Event</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group"> 
                    <label>Title: </label>
                    <input type="text"
                        required
                        className="form-control"
                        value={title}
                        onChange={onChangeTitle}
                        />
                </div>
                <div className="form-group"> 
                    <label>Category: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={category}
                        onChange={onChangeCategory}
                        />
                </div>
                <div className="form-group">
                    <label>Date of Event: </label>
                    <br />
                    <DatePicker
                        selected={dateOfEvent}
                        onChange={(newDate) => setDateOfEvent(newDate)}
                    />
                </div>
                <div className="form-group"> 
                    <label>Location: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={location}
                        onChange={onChangeLocation}
                        />
                </div>
                <div className="form-group"> 
                    <label>Participants: </label>
                    <select 
                        className="form-control"
                        value={participants} 
                        onChange={onChangeParticipants}>
                        <option 
                            key="youth"
                            value="youth">Youth
                        </option>
                        <option 
                            key="adult"
                            value="adult">Adult
                        </option>
                    </select>
                </div>
                <div className="form-group">
                    <input type="submit" value="Edit Event" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
}