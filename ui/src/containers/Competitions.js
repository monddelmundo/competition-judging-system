import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Competitions.css";
import { Link } from "react-router-dom";

export default function Competitions(props) {
    const [competitions, setCompetitions] = useState([]);
    const [events, setEvents] = useState({});
    const [selectedEvent, setSelectedEvent] = useState({});

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        axios.get('http://localhost:5000/events')
            .then(res => {
                if(res.data.length > 0) {
                    setEvents(res.data);
                    setSelectedEvent(res.data[0]);
                }
            })
    }

    return (
        <div className="competitions">
            <div>
                
                    
            </div>
        </div>
    );
}