import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Competitions.css";
import { Link } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import AlertDialog from "../components/Dialogs/Dialog";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from 'react-bootstrap';
import { showDialog } from '../components/Dialogs/Dialog';

const Competition = props => (
    <tr>
        <td>{props.competition.name}</td>
        <td>{props.competition.type}</td>
        <td>{props.competition.minNoOfPerson}</td>
        <td>{props.competition.maxNoOfPerson}</td>
        <td>
            <Link to={{ pathname: "/criterias", state: { competition: props.competition }}}><FontAwesomeIcon icon={faEye} fixedWidth />&nbsp;Criterias</Link> | <Link to={"/competitions/"+props.competition._id}><FontAwesomeIcon icon={faEdit} fixedWidth /></Link> | <Button variant="link" onClick={() => { props.deleteCompetition(props.competition._id); }} ><FontAwesomeIcon icon={faTrash} fixedWidth /></Button>
        </td>
    </tr>
  )

export default function Competitions(props) {
    const [competitions, setCompetitions] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [display, toDisplay] = useState(false);
    const [open, openDialog] = useState(false);
    const [msgType, setMsgType] = useState('');

    useEffect(() => {
        onLoad();
    }, []);

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
            
        await axios.get('http://localhost:5000/competitions/event_id/' + defaultID)
            .then(res => {
                if(res.data.length > 0) {
                    setCompetitions(res.data.sort((a,b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0)));
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
                <button className="btn btn-dark" onClick={() => props.history.push({ pathname: '/competitions/add', state: { eventID: selectedEvent }})}>Add Competition</button>
            </div>
        );
    }

    function competitionList() {
        return competitions.map(function(currCompetition) {
            return <Competition competition={currCompetition} deleteCompetition={deleteCompetition} key={currCompetition._id}/>;
        })
    }

    function deleteCompetition(id) {
        
        //setMsgType("delete");
        showDialog(true, "delete", (res) => {
            res.then((proceed) => {
                if(proceed) {
                    axios.delete('http://localhost:5000/competitions/'+id)
                        .then(res => console.log(res.data))

                    setCompetitions(competitions.filter(el => el._id !== id));
                } else
                    throw new Error("Error");
            })
            .catch(err => {
                console.error(err);
            });
        });
        //axios.delete('http://localhost:5000/competitions/'+id)
        //  .then(res => console.log(res.data));
        
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        
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
                        {competitionList().sort((a, b) => a.name > b.name ? 1 : -1)}
                    </tbody>
                </table>
                {displayAddButton()}
            </div>
        );
    }

    //function showDialog() {
    //    openDialog(true);
    //}

    return (
        <div className="competitions container">
            <AlertDialog open={open} msgType={msgType} />
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
                { display ? displayCompetitions() : <div><h3>Nothing to display!</h3>{displayAddButton()}</div>}
            </div>
            ) : <div><br /><h3>There is no Event as of the moment! Please create one first.</h3></div>}
        </div>
    );
}