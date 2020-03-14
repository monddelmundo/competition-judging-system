import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios'
import { useFormFields } from '../libs/hooksLib';
import LoaderButton from '../components/LoaderButton';

export default function EditCriteria(props) {

    const [competition, setCompetition] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0);

    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {
        setCompetition(props.location.state.competition);
        axios.get('http://localhost:5000/competitions/' + props.location.state.competition._id + '/criteria_id/' + props.match.params.id)
        .then(res => {
            setTitle(res.data.title);
            setValue(parseInt(res.data.value));
        })
        .catch(function (error) {
            console.log(error);
        })
        //console.log(fields.title);
    }

    function validateForm() {
        return title.length > 0 && value > 0;
    }

    function onChangeTitle(e) {
        setTitle(e.target.value);
    }

    function onChangeValue(e) {
        setValue(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        //todo
    }

    return (
        <div className="EditCriteria container">
            <h3>Edit Criteria</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="title" bsSize="large">
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={title}
                        onChange={onChangeTitle}
                    />
                </FormGroup>
                <FormGroup controlId="value" bsSize="large">
                    <ControlLabel>Percentage (%)</ControlLabel>
                    <FormControl
                        type="text"
                        value={value}
                        onChange={onChangeValue}
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
                        Update
                    </LoaderButton>
                </FormGroup>
            </form>
        </div>
    );
}