import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from '../libs/hooksLib';
import axios from 'axios';

export default function CreateCriteria(props) {

    const [competition, setCompetition] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        title: "",
        value: 0
    });

    useEffect(() => {
        onLoad();
    }, [])

    function onLoad() {
        setCompetition(props.location.state.competition);
    }

    function validateForm() {
        return fields.title.length > 0 && fields.value > 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        axios.post('http://localhost:5000/competitions/' + props.location.state.competition._id + '/add', fields)
            .then(res => {
                props.history.push({
                    pathname: '/criterias',
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
        props.history.push({
            pathname: '/criterias',
            state: {
                competition: competition
            }
        });
    }

    return (
        <div className="create-criteria container">
            <h3>Create Criteria</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="title">
                    <FormLabel>Title</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.title}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="value">
                    <FormLabel>Percentage (%)</FormLabel>
                    <FormControl
                        type="text"
                        value={fields.value}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="submit">
                    <LoaderButton
                        block
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Create
                    </LoaderButton>
                </FormGroup>
            </form>
            <LoaderButton
                block
                
                onClick={handleCancel}
            >
                Cancel
            </LoaderButton>
        </div>
    );
}
