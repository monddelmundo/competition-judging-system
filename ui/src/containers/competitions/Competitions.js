import React, { useEffect, useState, useContext } from "react";
import "./Competitions.css";
import { Link } from "react-router-dom";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import {
  faTrash,
  faEdit,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import SelectEvent from "../../components/SelectEvent";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { loadEventsAction } from "../../context/actions/EventActions";
import {
  loadCompetitionsAction,
  deleteCompetitionAction,
} from "../../context/actions/CompetitionActions";
import Spinner from "../../components/Spinner";

const Competition = (props) => (
  <tr>
    <td>{props.competition.name}</td>
    <td>{props.competition.type}</td>
    <td>{props.competition.minNoOfPerson}</td>
    <td>{props.competition.maxNoOfPerson}</td>
    <td>
      <Link
        to={{
          pathname: "/criterias",
          state: { competition: props.competition },
        }}
      >
        <FontAwesomeIcon icon={faEye} fixedWidth />
        &nbsp;Criterias
      </Link>
      &nbsp; | &nbsp;
      <Link to={"/competitions/" + props.competition._id}>
        <FontAwesomeIcon icon={faEdit} fixedWidth />
      </Link>
      &nbsp; |
      <Button
        variant="link"
        onClick={() => {
          props.deleteCompetition(props.competition._id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} fixedWidth />
      </Button>
    </td>
  </tr>
);

export default function Competitions(props) {
  const [competitions, setCompetitions] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [display, toDisplay] = useState(false);
  const { state, dispatch } = useContext(store);
  const [isApiInProgress, setIsApiInProgress] = useState(true);

  useEffect(() => {
    onLoad();
  }, [state.events, state.competitions]);

  async function onLoad() {
    let defaultID = "";

    try {
      if (state.events.length === 0) {
        await loadEventsAction(dispatch);
      }
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }

    if (state.events.length > 0) {
      setEvents(
        state.events.sort((a, b) =>
          a.title > b.title ? -1 : b.title > a.title ? 1 : 0
        )
      );

      setSelectedEvent(state.events[0]._id);
      defaultID = state.events[0]._id;

      if (
        state.competitions.length > 0 &&
        getCompetitionById(defaultID).length > 0
      ) {
        setCompetitions(
          getCompetitionById(defaultID).sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );

        toDisplay(true);
      }
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getCompetitionById(id) {
    return state.competitions.filter(
      (competition) => competition.event_id == id
    );
  }

  function onChangeSelectedEvent(e) {
    setSelectedEvent(e.target.value);
  }

  function handleViewBtn() {
    setCompetitions([]);

    if (
      state.competitions.length > 0 &&
      getCompetitionById(selectedEvent).length > 0
    ) {
      setCompetitions(
        getCompetitionById(selectedEvent).sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        )
      );
      toDisplay(true);
    } else toDisplay(false);
  }

  function displayAddButton() {
    return (
      <div>
        <Button
          variant="light"
          size="lg"
          onClick={() =>
            props.history.push({
              pathname: "/competitions/add",
              state: { eventID: selectedEvent },
            })
          }
        >
          <FontAwesomeIcon icon={faPlus} /> Competition
        </Button>
      </div>
    );
  }

  function competitionList() {
    return competitions.map(function (currCompetition) {
      return (
        <Competition
          competition={currCompetition}
          deleteCompetition={deleteCompetition}
          key={currCompetition._id}
        />
      );
    });
  }

  function deleteCompetition(id) {
    showDialog(true, "delete", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            toast.success("Competition was deleted successfully!");
            //axios
            //  .delete("http://localhost:5000/competitions/" + id)
            //deleteCompetitionApi(id).then((res) => console.log(res.data));
            deleteCompetitionAction(dispatch, id).catch((err) => {
              console.error(err);
              toast.error("Error Deleting this data! " + err.message);
            });

            //setCompetitions(competitions.filter((el) => el._id !== id));
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error Deleting this data!");
        });
    });
  }

  function displayCompetitions() {
    return (
      <div>
        <h5>List of Competition(s) for Selected Event</h5>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Min. # of Person</th>
              <th>Max # of Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{competitionList()}</tbody>
        </table>
        {displayAddButton()}
      </div>
    );
  }

  return (
    <div className="competitions container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <>
          {events.length > 0 ? (
            <div className="lander">
              <div>
                <FormGroup>
                  <br />
                  <SelectEvent
                    events={events}
                    selectedEvent={selectedEvent}
                    onChangeSelectedEvent={onChangeSelectedEvent}
                  />
                  <br />
                  <button className="btn btn-dark" onClick={handleViewBtn}>
                    View
                  </button>
                </FormGroup>
              </div>
              {display ? (
                displayCompetitions()
              ) : (
                <div>
                  <h3>Nothing to display!</h3>
                  {displayAddButton()}
                </div>
              )}
            </div>
          ) : (
            <div>
              <br />
              <h3>
                There is no Event as of the moment! Please create one first.
              </h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
