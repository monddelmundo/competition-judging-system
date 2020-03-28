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

    useEffect(() => {
        onLoad();
    }, [])

    async function onLoad() {
        setJudge(props.location.state.judge);

        await axios.get('http://localhost:5000/churches/getIDNumberName')
            .then(res => {
                if(res.data.length > 0) {
                    //sorts title of events in reverse to get latest event
                    setChurches(res.data.sort((a,b) => (a.churchNumber > b.churchNumber) ? 1 : ((b.churchNumber > a.churchNumber) ? -1 : 0)));
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
                            <tr>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                                <td>Choreography (Creativity, Artistry, Style & Originality)</td>
                            </tr>
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
                        <Col sm={1}>
                        <Nav variant="pills" className="flex-column">
                            {tabHeading()}
                        </Nav>
                        </Col>
                        <Col sm={11}>
                        <Tab.Content>
                            {scoresheetsList()}
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </div>
    )
}