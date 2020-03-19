import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import axios from "axios";

export default function CreateCompetition(props) {
    
    const [isLoading, setIsLoading] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        name: "",
        type: "",
        criterias: [],
        minNoOfPerson: 0,
        maxNoOfPerson: 0
    });

    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {

    }

    function validateForm() {
        return fields.name.length > 0 && fields.type != "" && fields.minNoOfPerson > 0 && fields.maxNoOfPerson > 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const newCompetition = {
            event_id: props.location.state.eventID,
            name: fields.name,
            type: fields.type,
            criterias: fields.criterias,
            minNoOfPerson: fields.minNoOfPerson,
            maxNoOfPerson: fields.maxNoOfPerson
        };

        axios.post('http://localhost:5000/competitions/add', newCompetition)
            .then(res => {
                props.history.push({
                    pathname: "/criterias/add",
                    state: {
                        competition: res.data
                    }
                });
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
                alert('Error adding this criteria.');
            });
    }

    function handleCancel() {
        props.history.push('/competitions');
    }

    return (
        <div className="create-competition container">
            <h3>Create Competition</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        placeholder="Enter Name"
                        value={fields.name}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="type" bsSize="large">
                    <ControlLabel>Type</ControlLabel>
                    <FormControl
                        componentClass="select"
                        value={fields.type}
                        onChange={handleFieldChange}
                    >
                        <option key="" value="">Select Type</option>
                        <option key="musical" value="musical">Musical</option>
                        <option key="literary" value="literary">Literary</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="minNoOfPerson" bsSize="large">
                    <ControlLabel>Min. # of Person</ControlLabel>
                    <FormControl
                        type="text"
                        value={fields.minNoOfPerson}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="maxNoOfPerson" bsSize="large">
                    <ControlLabel>Max # of Person</ControlLabel>
                    <FormControl
                        type="text"
                        value={fields.maxNoOfPerson}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="submit">
                <LoaderButton
                        block
                        type="submit"
                        bsSize="large"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Create
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