import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { faTrash, faEdit, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDialog, { showDialog } from '../components/Dialogs/Dialog';
import { notify } from '../components/Notifications/Notification';

const Event = props => (
    <tr>
      <td>{props.event.title}</td>
      <td>{props.event.category}</td>
      <td>{props.event.location}</td>
      <td>{props.event.status}</td>
      <td>
        <Link to={"/events/"+props.event._id}>
            <FontAwesomeIcon icon={faEdit} fixedWidth />
        </Link> 
        &nbsp; | 
        <Button variant="link" href="#" onClick={() => { props.deleteEvent(props.event._id) }}>
            <FontAwesomeIcon icon={faTrash} fixedWidth />
        </Button>
      </td>
    </tr>
  )

export default function Events(props) {
    
    const [events, setEvents] = useState([]);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        //console.log(props.decodedUser);
        axios.get('http://localhost:5000/events/')
            .then(res => {
                setEvents(res.data);
            })
    }

    function eventList() {
        return events.map(currEvent => {
            return <Event event={currEvent} deleteEvent={deleteEvent} key={currEvent._id}/>;
        })
    }

    function deleteEvent(id) {
        showDialog(true, "delete", (res) => {
            res.then((proceed) => {
                if(proceed) {
                    axios.delete('http://localhost:5000/events/'+id)
                        .then(res => console.log(res.data));

                    setEvents(events.filter(el => el._id !== id));

                    notify("Event was deleted successfully!", "success")
                } else
                    throw new Error("Error");
                })
                .catch(err => {
                    console.error(err);
                    notify("Error Deleting this data!", "error");
                });
        });
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        //setEvents({
        //  events: events.filter(el => el._id !== id)
        //})
    }
    
    return (
        <div className="events container">
            <AlertDialog />
            <div className="lander">
                <br />
                <h3>List of Event(s)</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventList()}
                    </tbody>
                </table>
            </div>
            <div className="lander">
                <Button variant="light" size="lg" onClick={() => props.history.push('/events/add')}><FontAwesomeIcon icon={faPlus} /> Event</Button>
            </div>
        </div>
    );
}