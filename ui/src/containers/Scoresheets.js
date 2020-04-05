import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Scoresheets.css';
import { FormGroup, FormControl, Button, Tab, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDialog, { showDialog } from '../components/Dialogs/Dialog';
import { notify } from '../components/Notifications/Notification';

export default function Scoresheets(props) {

    const [judge, setJudge] = useState('');
    const [churches, setChurches] = useState([]);
    const [competitions, setCompetitions] = useState([])
    const [selectedChurch, setSelectedChurch] = useState('');

    useEffect(() => {
        onLoad();
    }, [])

    async function onLoad() {
        await setJudge(props.location.state.judge);

        await axios.get('http://localhost:5000/churches/getIDNumberName')
            .then(res => {
                if(res.data.length > 0) {
                    //sorts title of events in reverse to get latest event
                    setChurches(res.data.sort((a,b) => (a.churchNumber > b.churchNumber) ? 1 : ((b.churchNumber > a.churchNumber) ? -1 : 0)));
                }
            })

        await axios.get('http://localhost:5000/competitions/scoresheet/' + props.location.state.event)
            .then(res => {
                if(res.data.length > 0) {
                    //sorts title of events in reverse to get latest event
                    setCompetitions(res.data);
                }
            })
    }

    function tabHeading() {
        return (
            churches.map((church) => 
                <Nav.Item key={church.churchNumber}>
                    <Nav.Link className="tab-nav-link" eventKey={church.churchNumber}>{`${church.churchNumber}`}</Nav.Link>
                </Nav.Item>
            )
        );
    }

    function getOverall(criterias, entries) {
        let retVal = 0;

        for( var i = 0; i < criterias.length; i++ ) {
            retVal += ((entries) ? entries[i] : 0)  * (criterias[i].value / 100);
        }

        return retVal;
    }

    function getScoresheet(church) {
        const scoresheet = judge.scoresheets.filter(s => s.church_id === church._id)[0];
        let musical = [ <tr><td>Musical</td><td></td><td></td><td></td><td></td><td></td></tr> ];
        let literary = [ <tr><td>Literary</td><td></td><td></td><td></td><td></td><td></td></tr> ];
        let retVal = [];
        
        (competitions.filter(c => c.type === "musical")).map((competition) => {
            let entry = [];

            if(scoresheet) {
                entry = scoresheet.musical.find(entry => entry.competition_id == competition._id);
            }
                
                musical.push(
                    <>
                        <tr>
                            <td></td>
                            <td>{competition.name}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{getOverall(competition.criterias, entry ? entry.criterias : [])}</td>
                        </tr>
                        {
                            competition.criterias.map((criteria, criteriaIndex) => (
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>{criteria.title}</td>
                                        <td>{criteria.value}</td>
                                        <td>{entry ? (entry.criterias ? entry.criterias[criteriaIndex] : 0) : 0}</td>
                                        <td></td>
                                    </tr>
                                )
                            )
                        }
                    </>
                )
            
            
        })
        retVal.push(musical);
        retVal.push(literary);
        
        return retVal;

        // if(scoresheet) {
        //     scoresheet.musical.map((entry) => { //switch this below
        //         let comp = competitions.find(competition => competition._id == entry.competition_id);
        //         let x = 0;
                
        //         if(comp) {
        //             console.log(comp)
        //             musical.push(
        //                 <>
        //                     <tr>
        //                         <td></td>
        //                         <td>{comp.name}</td>
        //                         <td></td>
        //                         <td></td>
        //                         <td></td>
        //                         <td>{getOverall(comp.criterias, entry.criterias)}</td>
        //                     </tr>
        //                     {
        //                         comp.criterias.map((criteria, criteriaIndex) => {
                                    
        //                             return (
        //                                 <tr>
        //                                     <td></td>
        //                                     <td></td>
        //                                     <td>{criteria.title}</td>
        //                                     <td>{criteria.value}</td>
        //                                     <td>{entry.criterias[criteriaIndex]}</td>
        //                                     <td></td>
        //                                 </tr>
        //                             );
        //                         })
        //                     }
        //                 </>
        //             )
        //         }
        //     })
            
        //     retVal.push(musical);
        //     retVal.push(literary);

        //     return retVal;
        // }
    }

    function scoresheetsList() {
        return (
            churches.map((church) => 
                <Tab.Pane key={church.churchNumber} eventKey={church.churchNumber}>
                    <h4>{church.name}</h4>
                    <div className="table-horiz-scroll">
                        <table className="table table-striped table-bordered table-sm">
                            <thead className="thead-light">
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Criterias</th>
                                    <th>Pct. (%)</th>
                                    <th>Score</th>
                                    <th>Overall</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getScoresheet(church)}
                            </tbody>
                        </table>
                    </div>
                </Tab.Pane>
            )
        );
    }

    function tblLegend() {
        return (
            <>
            <h6>LEGEND</h6>
            <table className="legend-table">
                <thead>
                    <tr>
                        <th className="legend-th">Number</th>
                        <th className="legend-th">Church</th>
                    </tr>
                </thead>
                <tbody>
                    {churches.map((church) => (
                        <tr>
                            <td align="center" className="legend-td">{church.churchNumber}</td>
                            <td className="legend-td">{church.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            </>
        );
    }

    return (
        <div className="scoresheets container">
            <AlertDialog />
            <div className="lander">
                <br />
                <h3>Scoresheet(s)</h3>
                <br />
                <Tab.Container id="left-tabs" defaultActiveKey="1" className="tab-container">
                    <Row>
                        <Col md={{ span: 11, order: 2 }}>
                            <Tab.Content>
                                {scoresheetsList()}
                            </Tab.Content>
                        </Col>
                        <Col md={{ span: 1, order: 1 }}>
                            <Nav variant="pills" className="flex-column">
                                {tabHeading()}
                            </Nav>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </div>
    )
}