import React, { useState, useEffect, useContext } from "react";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import AlertDialog from "../../components/dialogs/Dialog";
import { ScoresheetTbl } from "../../components/ScoreTable";
import { ExportCSV } from "../../components/ExportCSV";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { loadChurchesAction } from "../../context/actions/ChurchActions";
import { loadCompetitionsAction } from "../../context/actions/CompetitionActions";
import SelectCompetition from "../../components/SelectCompetition";
import Spinner from "../../components/Spinner";

export default function Scoresheet(props) {
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const { state, dispatch } = useContext(store);
  const [isApiInProgress, setIsApiInProgress] = useState(true);

  useEffect(() => {
    onLoad();
  }, [state.competitions]);

  async function onLoad() {
    try {
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }
      if (state.churches.length === 0) {
        await loadChurchesAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);

    // if (state.competitions.length > 0) {
    //   //   setSelectedCompetition(state.competitions[0]._id);
    //   setCompetitions(state.competitions);
    // }
  }

  function onChangeSelectedCompetition(e) {
    setSelectedCompetition(e.target.value);
  }

  function tabHeading() {
    if (state.churches.length > 0) {
      return state.churches
        .sort((a, b) =>
          a.churchNumber > b.churchNumber
            ? 1
            : b.churchNumber > a.churchNumber
            ? -1
            : 0
        )
        .map((church) => (
          <Nav.Item key={church.churchNumber}>
            <Nav.Link className="tab-nav-link" eventKey={church.churchNumber}>
              {church.churchNumber + ".) " + church.acronym}
            </Nav.Link>
          </Nav.Item>
        ));
    }
  }

  return (
    <div className="scoresheet container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <div className="lander">
          <SelectCompetition
            competitions={state.competitions
              .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
              .map((competition) => ({
                key: competition._id,
                value: competition.name,
              }))}
            selectedCompetition={selectedCompetition}
            onChangeSelectedCompetition={onChangeSelectedCompetition}
          />
          <Tab.Container
            id="left-tabs"
            defaultActiveKey="1"
            className="tab-container"
          >
            <Row>
              <Col md={{ span: 10, order: 2 }}>
                <Tab.Content></Tab.Content>
              </Col>
              <Col md={{ span: 2, order: 1 }}>
                <Nav variant="pills" className="flex-column">
                  {tabHeading()}
                </Nav>
                <br />
              </Col>
            </Row>
          </Tab.Container>
        </div>
      )}
    </div>
  );
}
