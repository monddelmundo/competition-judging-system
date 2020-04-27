import React, { useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
  loadJudgesAction,
  deleteJudgeAction,
} from "../../context/actions/JudgeActions";
import Spinner from "../../components/Spinner";

const Judge = (props) => {
  const name =
    props.judge.firstName +
    (props.judge.middleInitial ? " " + props.judge.middleInitial : "") +
    (props.judge.lastName ? " " + props.judge.lastName : "");

  return (
    <tr>
      <td>{name}</td>
      <td>{props.judge.accessCode}</td>
      <td>{props.judge.status}</td>
      <td>
        <Link
          to={{
            pathname: "/scoresheets",
            state: { judge: props.judge, event: props.selectedEvent },
          }}
        >
          <FontAwesomeIcon icon={faEye} fixedWidth />
          &nbsp;Scoresheets
        </Link>
        &nbsp; | &nbsp;
        <Link to={"/judges/" + props.judge._id}>
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </Link>
        &nbsp; |
        <Button
          variant="link"
          href="#"
          onClick={() => {
            props.deleteJudge(props.judge._id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} fixedWidth />
        </Button>
      </td>
    </tr>
  );
};

export default function Judges(props) {
  const [events, setEvents] = useState([]);
  const [judges, setJudges] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [display, toDisplay] = useState(false);
  const [isApiInProgress, setIsApiInProgress] = useState(true);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, [state.events, state.judges]);

  async function onLoad() {
    let defaultID = "";

    try {
      if (state.events.length === 0) {
        await loadEventsAction(dispatch);
      }
      if (state.judges.length === 0) {
        await loadJudgesAction(dispatch);
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

      if (state.judges.length > 0 && getJudgeById(defaultID).length > 0) {
        setJudges(
          getJudgeById(defaultID).sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );

        toDisplay(true);
      }
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getJudgeById(id) {
    return state.judges.filter((judge) => judge.event_id == id);
  }

  function onChangeSelectedEvent(e) {
    setSelectedEvent(e.target.value);
  }

  function handleViewBtn() {
    setJudges([]);

    if (state.judges.length > 0 && getJudgeById(selectedEvent).length > 0) {
      setJudges(
        getJudgeById(selectedEvent).sort((a, b) =>
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
              pathname: "/judges/add",
              state: { eventID: selectedEvent },
            })
          }
        >
          <FontAwesomeIcon icon={faPlus} /> Judge
        </Button>
      </div>
    );
  }

  function judgeList() {
    return judges.map(function (currJudge) {
      return (
        <Judge
          judge={currJudge}
          deleteJudge={deleteJudge}
          key={currJudge._id}
          selectedEvent={selectedEvent}
        />
      );
    });
  }

  function deleteJudge(id) {
    showDialog(true, "delete", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            toast.success("Judge was deleted successfully!");
            deleteJudgeAction(dispatch, id).catch((err) => {
              console.error(err);
              toast.error("Error Deleting this data! " + err.message);
            });
            //deleteJudgeApi(id).then((res) => console.log(res.data));
            //setJudges(judges.filter((jl) => jl._id !== id));
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error Deleting this data!");
        });
    });
  }

  function displayJudges() {
    return (
      <div>
        <h3>List of Judge(s) for Selected Event</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Access Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {judgeList().sort((a, b) => (a.name > b.name ? 1 : -1))}
          </tbody>
        </table>
        {displayAddButton()}
      </div>
    );
  }

  return (
    <div className="judges container">
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
                displayJudges()
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
