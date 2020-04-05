import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Criterias.css';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import AlertDialog, { showDialog } from '../components/Dialogs/Dialog';
import { notify } from '../components/Notifications/Notification';
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Criteria = props => (
    <tr>
        <td>{props.criteria.title}</td>
        <td>{props.criteria.value}</td>
        <td>
            <Link to={{ pathname: "/criterias/"+props.criteria._id, state: { competition: props.competition }}}>
                <FontAwesomeIcon icon={faEdit} fixedWidth />
            </Link> 
            &nbsp; |
            <Button variant="link" onClick={() => { 
                props.deleteCriteria(props.criteria._id) 
            }}>
                <FontAwesomeIcon icon={faTrash} fixedWidth />
            </Button>
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
        showDialog(true, "delete", (res) => {
            res.then((proceed) => {
                if(proceed) {
                    axios.delete('http://localhost:5000/competitions/' + competition._id + '/delete/'+id)
                        .then((res) => { 
                            console.log(res.data);
                            let comp = competition;

                            comp.criterias = comp.criterias.filter(cl => cl._id !== id);
                            notify("Criteria was deleted successfully!", "success")

                            props.history.push({
                                pathname: '/criterias',
                                state: {
                                    competition: comp
                                }
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            notify("Error Deleting this data!", "error");
                        });                    
                } else
                    throw new Error("Error");
                })
                .catch(err => {
                    console.error(err);
                    notify("Error Deleting this data!", "error");
                });
            });
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
                totals += parseFloat(criteria.value);
            })
        }
        return totals;
    }

    return (
        <div className="criterias container">
            <AlertDialog />
            <div className="lander">
                <br />
                <h3>List of Criteria(s) for {competition.name}</h3>
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
                <Button variant="light" size="lg" onClick={() => props.history.push({ pathname: '/criterias/add', state: { competition: competition }})}><FontAwesomeIcon icon={faPlus} /> Criterias</Button>
            </div>
        </div>
    );
}