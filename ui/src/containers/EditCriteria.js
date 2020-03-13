import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios'

export default function EditCriteria(props) {

    const [competition, setCompetition] = useState('');

    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {
        setCompetition(props.location.state.competition);
    }


    return (
        <div></div>
    );
}