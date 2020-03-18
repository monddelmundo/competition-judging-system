import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from "../components/LoaderButton";

export default function EditCompetition(props) {

    const [eventID, setEventID] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [criterias, setCriterias] = useState([]);
    const [minNoOfPerson, setMinNoOfPerson] = useState(0);
    const [maxNoOfPerson, setMaxNoOfPerson] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        await axios.get('http://localhost:5000/competitions/' + props.match.params.id)
            .then(res => {
                setEventID(res.data.event_id)
                setName(res.data.name);
                setType(res.data.type);
                setCriterias(res.data.criterias);
                setMinNoOfPerson(res.data.minNoOfPerson);
                setMaxNoOfPerson(res.data.maxNoOfPerson);
            })
            .catch(function (error) {
                console.log(error);
            })
        
    }

    function validateForm() {
        return name.length > 0 && minNoOfPerson > 0 && maxNoOfPerson > 0;
    }

    function onChangeName(e) {
        setName(e.target.value);
    }

    function onChangeType(e) {
        setType(e.target.value);
    }

    function onChangeMinNoOfPerson(e) {
        setMinNoOfPerson(e.target.value);
    }

    function onChangeMaxNoOfPerson(e) {
        setMaxNoOfPerson(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const updatedCompetition = {
            event_id: eventID,
            name: name,
            type: type,
            criterias: criterias,
            minNoOfPerson: minNoOfPerson,
            maxNoOfPerson: maxNoOfPerson
        };

        axios.post('http://localhost:5000/competitions/update/' + props.match.params.id, updatedCompetition)
            .then(res => console.log(res.data))
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                alert('Error updating this competition.');
            });

        props.history.push('/competitions');
        window.location.reload();
    }

    function handleCancel() {
        props.history.push('/competitions');
    }

    return (
        <div className="edit-competition container">
            <h3>Edit Competition</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={name}
                        onChange={onChangeName}
                    />
                </FormGroup>
                <FormGroup controlId="type" bsSize="large">
                    <ControlLabel>Type</ControlLabel>
                    <FormControl
                        componentClass="select"
                        value={type}
                        onChange={onChangeType}
                    >
                        <option key="musical" value="musical">Musical</option>
                        <option key="literary" value="literary">Literary</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="minNoOfPerson" bsSize="large">
                    <ControlLabel>Min. # of Person</ControlLabel>
                    <FormControl
                        type="text"
                        value={minNoOfPerson}
                        onChange={onChangeMinNoOfPerson}
                    />
                </FormGroup>
                <FormGroup controlId="maxNoOfPerson" bsSize="large">
                    <ControlLabel>Max # of Person</ControlLabel>
                    <FormControl
                        type="text"
                        value={maxNoOfPerson}
                        onChange={onChangeMaxNoOfPerson}
                    />
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
            <LoaderButton
                block
                bsSize="large"
                onClick={handleCancel}
            >
                Cancel
            </LoaderButton>
        </div>
    );
}