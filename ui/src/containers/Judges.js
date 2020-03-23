import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom";

const Judge = props => {

    const name = props.judge.firstName + 
        ((props.judge.middleInitial) ? 
        " " + props.judge.middleInitial : "") + 
        ((props.judge.lastName) ? 
        " " + props.judge.lastName: "");

    return (
        <tr>
            <td>{name}</td>
            <td>{props.judge.accessCode}</td>
            <td>{props.judge.status}</td>
            <td>
                <Link to={{ pathname: "/scoresheets", state: { judge: props.judge }}}>View Scoresheets</Link> | <Link to={"/judges/"+props.judge._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteJudge(props.judge._id) }}>Delete</a>
            </td>
        </tr>
    );
}

export default function Judges(props) {

    const [events, setEvents] = useState([]);
    const [judges, setJudges] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [display, toDisplay] = useState(false);

    useEffect(() => {
        onLoad();
    }, [])

    async function onLoad() {
        let defaultID = '';
        
        await axios.get('http://localhost:5000/events')
            .then(res => {
                if(res.data.length > 0) {
                    //sorts title of events in reverse to get latest event
                    setEvents(res.data.sort((a,b) => (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0)));
                    setSelectedEvent(res.data[0]._id);
                    defaultID = res.data[0]._id;
                }
            })
            
        await axios.get('http://localhost:5000/judges/event_id/' + defaultID)
            .then(res => {
                if(res.data.length > 0) {
                    setJudges(res.data);
                    toDisplay(true);
                } else {
                    toDisplay(false);
                }
            })
    }

    function onChangeSelectedEvent(e) {
        setSelectedEvent(e.target.value);
    }

    function handleViewBtn() {
        setJudges([]);
        axios.get('http://localhost:5000/judges/event_id/' + selectedEvent)
            .then(res => {
                if(res.data.length > 0) {
                    setJudges(res.data);
                    toDisplay(true);
                } else {
                    toDisplay(false);
                }
            })
    }

    function displayAddButton() {
        return (
            <div>
                <br/>
                <button className="btn btn-dark" onClick={() => props.history.push({ pathname: '/judges/add', state: { eventID: selectedEvent }})}>Add Judge</button>
            </div>
        );
    }

    function judgeList() {
        return judges.map(function(currJudge) {
            return <Judge judge={currJudge} deleteJudge={deleteJudge} key={currJudge._id}/>;
        })
    }

    function deleteJudge(id) {
        axios.delete('http://localhost:5000/judges/'+id)
          .then(res => console.log(res.data));
        
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        //setEvents({
        //  events: events.filter(el => el._id !== id)
        //})
    }

    function displayJudges() {
        return (
            <div>
                <h3>List of Judge(s) for Selected Event</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Name</th>
                            <th>Access Code</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {judgeList().sort((a, b) => a.name > b.name ? 1 : -1)}
                    </tbody>
                </table>
                {displayAddButton()}
            </div>
        );
    }

    return (
        <div className="judges container">
            { (events.length > 0) ? (
            <div className="lander">
                <div>
                    <FormGroup>
                        <br />
                        <h5>Choose Event</h5>
                        <FormControl
                            autoFocus
                            as="select"
                            value={selectedEvent}
                            onChange={onChangeSelectedEvent}
                        >
                            {
                                events.map(function(event) {
                                    return ( <option key={event._id} value={event._id}>{event.title}</option> )
                                })
                            }
                        </FormControl>
                        <br />
                        <button className="btn btn-dark" onClick={handleViewBtn}>View</button>
                    </FormGroup>
                </div>
                {(display) ? displayJudges() : <div><h3>Nothing to display!</h3>{displayAddButton()}</div>}
            </div>
            ) : <div><br /><h3>There is no Event as of the moment! Please create one first.</h3></div>}
            
        </div>
    );
}