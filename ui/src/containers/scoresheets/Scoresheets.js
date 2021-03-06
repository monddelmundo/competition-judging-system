import React, { useState, useEffect, useContext } from "react";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import AlertDialog from "../../components/dialogs/Dialog";
import { ScoresheetTbl } from "../../components/ScoreTable";
import { ExportCSV } from "../../components/ExportCSV";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { loadChurchesAction } from "../../context/actions/ChurchActions";
import { loadCompetitionsAction } from "../../context/actions/CompetitionActions";
import Spinner from "../../components/Spinner";

export default function Scoresheets(props) {
  const [judge, setJudge] = useState("");
  const [churches, setChurches] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const { state, dispatch } = useContext(store);
  const [isApiInProgress, setIsApiInProgress] = useState(true);

  useEffect(() => {
    onLoad();
  }, [state.competitions, state.churches]);

  async function onLoad() {
    await setJudge(props.location.state.judge);

    try {
      if (state.churches.length === 0) {
        await loadChurchesAction(dispatch);
      }
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }

    if (props.location.state.event) {
      let eventId = props.location.state.event;

      if (
        state.competitions.length > 0 &&
        getCompetitionsById(eventId).length > 0 &&
        state.churches.length > 0 &&
        getChurchesById(eventId).length > 0
      ) {
        setCompetitions(
          getCompetitionsById(eventId).sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );

        setChurches(
          getChurchesById(eventId).sort((a, b) =>
            a.churchNumber > b.churchNumber
              ? 1
              : b.churchNumber > a.churchNumber
              ? -1
              : 0
          )
        );
      }
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getCompetitionsById(id) {
    return state.competitions.filter(
      (competition) => competition.event_id == id
    );
  }

  function getChurchesById(id) {
    return state.churches.filter((church) => church.event_id == id);
  }

  function tabHeading() {
    return churches.map((church) => (
      <Nav.Item key={church.churchNumber}>
        <Nav.Link
          className="tab-nav-link"
          eventKey={church.churchNumber}
        >{`${church.acronym}`}</Nav.Link>
      </Nav.Item>
    ));
  }

  function getOverall(criterias, entries) {
    let retVal = 0;

    for (var i = 0; i < criterias.length; i++) {
      retVal +=
        (entries ? (entries[i] ? entries[i] : 0) : 0) *
        (criterias[i].value / 100);
    }

    return retVal;
  }

  function round(number) {
    return Math.round((number + 0.00001) * 100) / 100;
  }

  function getScoresheet(church) {
    const scoresheet = judge.scoresheets.filter(
      (s) => s.church_id === church._id
    )[0];
    let musical = [
      {
        type: "Musical",
        title: "",
        criterias: "",
        pct: "",
        score: "",
        total: "",
        overall: "",
        overallTotal: "",
      },
    ];
    let literary = [
      {
        type: "Literary",
        title: "",
        criterias: "",
        pct: "",
        score: "",
        total: "",
        overall: "",
        overallTotal: "",
      },
    ];
    let retVal = [];
    let total = [];
    let overall = [];

    competitions
      .filter((c) => c.type === "musical")
      .map((competition) => {
        let entry = [];

        if (scoresheet) {
          entry = scoresheet.musical.find(
            (entry) => entry.competition_id === competition._id
          );
        }

        musical.push({
          type: "",
          title: competition.name,
          criterias: "",
          pct: "",
          score: "",
          total: "",
          overall: "",
          overallTotal: "",
        });
        competition.criterias.map((criteria, criteriaIndex) => {
          musical.push({
            type: "",
            title: "",
            criterias: criteria.title,
            pct: criteria.value,
            score: (entry
              ? entry.criterias
                ? entry.criterias[criteriaIndex]
                : 0
              : 0
            ).toString(),
            total: "",
            overall: "",
            overallTotal: "",
          });

          return;
        });

        musical.push({
          type: "",
          title: "",
          criterias: "",
          pct: "",
          score: "",
          total: total[
            total.push(
              round(
                getOverall(competition.criterias, entry ? entry.criterias : [])
              )
            ) - 1
          ].toString(),
          overall: "",
          overallTotal: "",
        });
        return;
      });

    musical.push({
      type: "",
      title: "",
      criterias: "",
      pct: "",
      score: "",
      total: "",
      overall: overall[
        overall.push(round(total.reduce((a, b) => a + b, 0) / total.length)) - 1
      ].toString(),
      overallTotal: "",
    });

    total = [];

    competitions
      .filter((c) => c.type === "literary")
      .map((competition) => {
        let entry = [];

        if (scoresheet) {
          entry = scoresheet.literary.find(
            (entry) => entry.competition_id === competition._id
          );
        }

        literary.push({
          type: "",
          title: competition.name,
          criterias: "",
          pct: "",
          score: "",
          total: "",
          overall: "",
          overallTotal: "",
        });
        competition.criterias.map((criteria, criteriaIndex) => {
          literary.push({
            type: "",
            title: "",
            criterias: criteria.title,
            pct: criteria.value,
            score: (entry
              ? entry.criterias
                ? entry.criterias[criteriaIndex]
                : 0
              : 0
            ).toString(),
            total: "",
            overall: "",
            overallTotal: "",
          });
        });

        literary.push({
          type: "",
          title: "",
          criterias: "",
          pct: "",
          score: "",
          total: total[
            total.push(
              round(
                getOverall(competition.criterias, entry ? entry.criterias : [])
              )
            ) - 1
          ].toString(),
          overall: "",
          overallTotal: "",
        });
      });

    literary.push({
      type: "",
      title: "",
      criterias: "",
      pct: "",
      score: "",
      total: "",
      overall: overall[
        overall.push(round(total.reduce((a, b) => a + b, 0) / total.length)) - 1
      ].toString(),
      overallTotal: "",
    });

    retVal = retVal.concat(musical);
    retVal = retVal.concat(literary);

    retVal = retVal.concat({
      type: "",
      title: "",
      criterias: "",
      pct: "",
      score: "",
      total: "",
      overall: "",
      overallTotal: round(
        overall.reduce((a, b) => a + b, 0) / overall.length
      ).toString(),
    });

    return retVal;
  }

  function scoresheetsList() {
    return churches.map((church) => {
      let tbl = { rows: [], cols: [] };

      tbl.cols.push({
        type: "Type",
        title: "Title",
        criterias: "Criterias",
        pct: "Pct. (%)",
        score: "Score",
        total: "Total",
        overall: "Overall",
        overallTotal: "Overall Overall",
      });
      tbl.rows = getScoresheet(church);

      return (
        <Tab.Pane key={church.churchNumber} eventKey={church.churchNumber}>
          <div>
            <div>
              <h4>{church.name}</h4>
            </div>
            <div className="btnExport">
              <ExportCSV
                csvData={tbl.rows}
                sheetName={judge.firstName[0] + "_" + judge.lastName}
                fileName={`${church.name}_Scoresheet.xlsx`}
              />
            </div>
            <div className="table-horiz-scroll">
              <ScoresheetTbl rows={tbl.rows} cols={tbl.cols} />
            </div>
          </div>
        </Tab.Pane>
      );
    });
  }

  return (
    <div className="scoresheets container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <div className="lander">
          <br />
          <Tab.Container
            id="left-tabs"
            defaultActiveKey="1"
            className="tab-container"
          >
            <Row>
              <Col md={{ span: 10, order: 2 }}>
                <Tab.Content>{scoresheetsList()}</Tab.Content>
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
