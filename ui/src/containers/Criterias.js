import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Criterias.css';
import { Link } from "react-router-dom";

const Criteria = props => (
    <tr>
        <td>{props.criteria.title}</td>
        <td>{props.criteria.value}</td>
        <td>
            <Link to={"/criterias/"+props.criteria._id}>Edit</Link> | <Link to={{ pathname: "/criterias", state: { competition: props.competition }}} onClick={() => { props.deleteCriteria(props.criteria._id) }}>Delete</Link>
        </td>
    </tr>
)

export default function Criterias(props) {
//<Link to={"/criterias/"+props.criteria._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteCriteria(props.criteria._id) }}>Delete</a>
    const [competition, setCompetition] = useState('');

    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {
        setCompetition(props.location.state.competition);
        
    }

    function deleteCriteria(id) {
        axios.delete('http://localhost:5000/competitions/' + competition._id + '/criteria_id/'+id)
            .then(res => console.log(res.data));
        
        props.location.state.competition.criterias = competition.criterias.filter(cl => cl._id !== id);
    }

    function criteriaList() {
        let criterias = competition.criterias;
        if(criterias) {          
            return criterias.map(currCriteria => {
                return <Criteria competition={competition} criteria={currCriteria} deleteCriteria={deleteCriteria} key={currCriteria._id}/>;
            })
        }
    }

    function computeTotal(competition) {
        let criterias = competition.criterias;
        let totals = 0;
        if(criterias) {
            criterias.map(criteria => {
                totals += parseInt(criteria.value);
            })
        }
        return totals;
    }

    return (
        <div className="Criterias container">
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
                <button className="btn btn-dark" onClick={() => props.history.push('/criterias/add')}>Create Criterias</button>
            </div>
        </div>
    );
}