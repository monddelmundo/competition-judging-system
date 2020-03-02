import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const Event = props => (
    <tr>
      <td>{props.event.title}</td>
      <td>{props.event.category}</td>
      <td>{props.event.dateOfEvent.substring(0,10)}</td>
      <td>{props.event.location}</td>
      <td>{props.event.participants}</td>
      <td>{props.event.status}</td>
      <td>
        <Link to={"/edit/"+props.event._id}>edit</Link> | <a href="#" onClick={() => { props.deleteEvent(props.event._id) }}>delete</a>
      </td>
    </tr>
  )

export default function Events(props) {
    
    const [events, setEvents] = useState([]);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        axios.get('events/')
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
        axios.delete('events/'+id)
          .then(res => console.log(res.data));
        
        //removes the deleted exercise from the state events' array
        //_id came from mongodb's object name
        setEvents({
          events: events.filter(el => el._id !== id)
        })
      }
    
    return (
        <div className="Events">
            <div className="lander">
                <br />
                <h3>List of Events</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date of Event</th>
                            <th>Location</th>
                            <th>Participants</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventList()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}