import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Competitions.css";
import { Link } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";

const Competition = props => (
    <tr>
        <td>{props.competition.name}</td>
        <td>{props.competition.type}</td>
        <td>{props.competition.minNoOfPerson}</td>
        <td>{props.competition.maxNoOfPerson}</td>
        <td>
            <Link to={{ pathname: "/criterias", state: { competition: props.competition }}}>View Criterias</Link> | <Link to={"/competitions/"+props.competition._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteEvent(props.competition._id) }}>Delete</a>
        </td>
    </tr>
  )

export default function Competitions(props) {
    const [competitions, setCompetitions] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [display, toDisplay] = useState(false);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        let defaultID = '';

        await axios.get('http://localhost:5000/events')
            .then(res => {
                if(res.data.length > 0) {
                    setEvents(res.data);
                    setSelectedEvent(res.data[0]._id);
                    defaultID = res.data[0]._id;
                }
            })

        await axios.get('http://localhost:5000/competitions/event_id/' + defaultID)
            .then(res => {
                if(res.data.length > 0) {
                    setCompetitions(res.data);
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
        setCompetitions([]);
        axios.get('http://localhost:5000/competitions/event_id/' + selectedEvent)
            .then(res => {
                if(res.data.length > 0) {
                    setCompetitions(res.data);
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
                <button className="btn btn-dark" onClick={() => props.history.push('/competitions/add/' + selectedEvent)}>Create Competition</button>
            </div>
        );
    }

    function deleteCompetition(id) {
        axios.delete('http://localhost:5000/competitions/'+id)
          .then(res => console.log(res.data));
        
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        //setEvents({
        //  events: events.filter(el => el._id !== id)
        //})
    }

    function displayCompetitions() {
        return (
            <div>
                <h3>List of Competition(s) for Selected Event</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Min. # of Person</th>
                            <th>Max # of Person</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            competitions.map(function(comp) {
                                return <Competition competition={comp} deleteComp={deleteCompetition} key={comp._id}/>;
                            })
                        }
                    </tbody>
                </table>
                {displayAddButton()}
            </div>
        );
    }

    return (
        <div className="competitions container">
            <div className="lander">
                <div>
                    <FormGroup>
                        <br />
                        <h5>Choose Event</h5>
                        <FormControl
                            autoFocus
                            componentClass="select"
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
            </div>
            { display ? displayCompetitions() : <div><h3>Nothing to display!</h3>{displayAddButton()}</div>}
        </div>
    );
}