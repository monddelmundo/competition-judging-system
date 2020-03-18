import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";
import { Link } from "react-router-dom";

const Event = props => (
    <tr>
      <td>{props.event.title}</td>
      <td>{props.event.category}</td>
      <td>{props.event.location}</td>
      <td>{props.event.status}</td>
      <td>
        <Link to={"/events/"+props.event._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteEvent(props.event._id) }}>Delete</a>
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
        axios.delete('http://localhost:5000/events/'+id)
          .then(res => console.log(res.data));
        
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        //setEvents({
        //  events: events.filter(el => el._id !== id)
        //})
    }
    
    return (
        <div className="events container">
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
                <br/>
                <button className="btn btn-dark" onClick={() => props.history.push('/events/add')}>Create Event</button>
            </div>
        </div>
    );
}