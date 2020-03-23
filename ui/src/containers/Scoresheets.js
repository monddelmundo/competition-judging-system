import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Scoresheets(props) {

    const [judge, setJudge] = useState('');

    useEffect(() => {
        onLoad();
    }, [])

    function onLoad() {
        setJudge(props.location.state.judge);
    }



    return (
        <div className="scoresheets container">
            <div className="lander">
                <br />
                <h3>List of Criteria(s)</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th width={'65%'}>Title</th>
                            <th>Percentage (%)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criteriaList()}
                        <tr>
                            <td className="bold">Total</td>
                            <td className="bold">
                                {
                                    computeTotal(competition)
                                }
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="lander">
                <br/>
                <button className="btn btn-dark" onClick={() => props.history.push({ pathname: '/criterias/add', state: { competition: competition }})}>Create Criterias</button>
            </div>
        </div>
    )
}