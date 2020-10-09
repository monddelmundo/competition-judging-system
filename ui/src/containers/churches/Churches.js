import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import SelectEvent from "../../components/SelectEvent";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { loadEventsAction } from "../../context/actions/EventActions";
import {
  loadChurchesAction,
  deleteChurchAction,
} from "../../context/actions/ChurchActions";
import Spinner from "../../components/Spinner";

const Church = (props) => (
  <tr>
    <td>{props.church.name}</td>
    <td>{props.church.acronym}</td>
    <td>{props.church.churchNumber}</td>
    <td>
      <Link
        to={{
          pathname: "/participants",
          state: { church: props.church },
        }}
      >
        <FontAwesomeIcon icon={faEye} fixedWidth />
        &nbsp;Participants
      </Link>
      &nbsp; | &nbsp;
      <Link to={"/churches/" + props.church._id}>
        <FontAwesomeIcon icon={faEdit} fixedWidth />
      </Link>
      &nbsp; |
      <Button
        variant="link"
        onClick={() => {
          props.deleteChurch(props.church._id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} fixedWidth />
      </Button>
    </td>
  </tr>
);

export default function Churches(props) {
  const [churches, setChurches] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [display, toDisplay] = useState(false);
  const { state, dispatch } = useContext(store);
  const [isApiInProgress, setIsApiInProgress] = useState(true);

  useEffect(() => {
    onLoad();
  }, [state.churches, state.events]);

  async function onLoad() {
    let defaultID = "";

    try {
      if (state.events.length === 0) {
        await loadEventsAction(dispatch);
      }
      if (state.churches.length === 0) {
        await loadChurchesAction(dispatch);
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

      if (state.churches.length > 0 && getChurchesById(defaultID).length > 0) {
        setChurches(
          getChurchesById(defaultID).sort((a, b) =>
            a.churchNumber > b.churchNumber
              ? 1
              : b.churchNumber > a.churchNumber
              ? -1
              : 0
          )
        );

        toDisplay(true);
      }
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);
  }

  function getChurchesById(id) {
    return state.churches.filter((church) => church.event_id == id);
  }

  function onChangeSelectedEvent(e) {
    setSelectedEvent(e.target.value);
  }

  function handleViewBtn() {
    setChurches([]);

    if (
      state.churches.length > 0 &&
      getChurchesById(selectedEvent).length > 0
    ) {
      setChurches(
        getChurchesById(selectedEvent).sort((a, b) =>
          a.churchNumber > b.churchNumber
            ? 1
            : b.churchNumber > a.churchNumber
            ? -1
            : 0
        )
      );
      toDisplay(true);
    } else toDisplay(false);
  }

  function displayAddButton() {
    return (
      <AddButton
        label={"Church"}
        pathname={"/churches/add"}
        state={{ eventID: selectedEvent }}
        history={props.history}
      />
    );
  }

  function deleteChurch(id) {
    showDialog(true, "delete", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            toast.success("Church data was deleted successfully!");
            deleteChurchAction(dispatch, id).catch((err) => {
              console.error(err);
              toast.error("Error Deleting this data! " + err.message);
            });
          } else throw new Error("Error");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error Deleting this data!");
        });
    });
  }

  function churchList() {
    return churches.map(function (currChurch) {
      return (
        <Church
          church={currChurch}
          deleteChurch={deleteChurch}
          key={currChurch._id}
        />
      );
    });
  }

  function displayChurches() {
    return (
      <div>
        <h5>List of Churches(s) for Selected Event</h5>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Acronym</th>
              <th>Church Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{churchList()}</tbody>
        </table>
        {displayAddButton()}
      </div>
    );
  }

  return (
    <div className="churches container">
      <AlertDialog />
      {isApiInProgress > 0 ? (
        <Spinner />
      ) : (
        <>
          {events.length > 0 ? (
            <div className="lander">
              <div>
                <SelectEvent
                  events={events}
                  selectedEvent={selectedEvent}
                  onChangeSelectedEvent={onChangeSelectedEvent}
                  handleViewBtn={handleViewBtn}
                />
              </div>
              {display ? (
                displayChurches()
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
