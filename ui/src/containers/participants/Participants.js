import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import SelectCategory from "../../components/SelectCategory";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import {
  loadChurchesAction,
  deleteParticipantAction,
} from "../../context/actions/ChurchActions";
import { loadCompetitionsAction } from "../../context/actions/CompetitionActions";
import Spinner from "../../components/Spinner";

const Participant = (props) => {
  const name =
    props.participant.firstName +
    (props.participant.middleInitial
      ? " " + props.participant.middleInitial
      : "") +
    (props.participant.lastName ? " " + props.participant.lastName : "");

  return (
    <tr>
      <td>{name}</td>
      <td>{props.participant.age}</td>
      <td>{props.participant.dateSaved}</td>
      <td>{props.participant.dateBaptized}</td>
      <td>
        <Link
          to={{
            pathname: "/participants/" + props.participant._id,
            state: { church: props.church },
          }}
        >
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </Link>
        &nbsp; |
        <Button
          variant="link"
          onClick={() => {
            props.deleteParticipant(props.participant._id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} fixedWidth />
        </Button>
      </td>
    </tr>
  );
};

export default function Participants(props) {
  const [church, setChurch] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { state, dispatch } = useContext(store);
  const [isApiInProgress, setIsApiInProgress] = useState(true);

  const categories = [
    {
      key: "musical",
      value: "Musical",
    },
    {
      key: "literary",
      value: "Literary",
    },
  ];

  useEffect(() => {
    onLoad();
  }, [state.competitions]);

  async function onLoad() {
    if (!props.location.state && !props.match.params.id) {
      toast.warn("Please choose a church first before proceeding...");
      props.history.push("/churches");
      return;
    }

    await setChurch(props.location.state.church);

    try {
      if (state.competitions.length === 0) {
        await loadCompetitionsAction(dispatch);
      }

      if (state.churches.length === 0) {
        props.history.push("/churches");
        //await loadChurchesAction(dispatch);
      }
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }

    setIsApiInProgress(state.apiCallsInProgress > 0);

    setSelectedCategory(categories[0].key);
  }

  function tabHeading() {
    if (state.competitions.length > 0) {
      return state.competitions
        .filter((competition) => competition.type == selectedCategory)
        .map((competition, index) => (
          <Nav.Item key={index}>
            <Nav.Link className="tab-nav-link" eventKey={index + 1}>
              {competition.name}
            </Nav.Link>
          </Nav.Item>
        ));
    }
  }

  function deleteParticipant(id) {
    showDialog(true, "delete", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            toast.success("Participant was deleted successfully!");
            let updatedChurch = church;
            updatedChurch.participants = updatedChurch.participants.filter(
              (cl) => cl._id !== id
            );

            props.history.push({
              pathname: "/participants",
              state: {
                church: updatedChurch,
              },
            });

            deleteParticipantAction(dispatch, church._id, id).catch((err) => {
              toast.error("Error Deleting this data! " + err.message);
            });
          } else throw new Error("Error");
        })
        .catch((err) => {
          toast.error("Error Deleting this data! " + err.message);
        });
    });
  }

  function participantsList() {
    if (state.competitions.length > 0) {
      return state.competitions
        .filter((competition) => competition.type == selectedCategory)
        .map((competition, index) => {
          const filteredParticipants = church.participants.filter(
            (participant) => participant.competition_id == competition._id
          );

          return (
            <Tab.Pane key={index + 1} eventKey={index + 1}>
              <div>
                {church.participants.length > 0 &&
                filteredParticipants.length > 0 ? (
                  <>
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Date Saved</th>
                          <th>Date Baptized</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredParticipants.map((participant) => (
                          <Participant
                            participant={participant}
                            deleteParticipant={deleteParticipant}
                            key={participant._id}
                            church={church}
                          />
                        ))}
                      </tbody>
                    </table>
                    <AddButton
                      label={"Participant"}
                      pathname={"/participants/add"}
                      state={{
                        church: church,
                        competition_id: competition._id,
                      }}
                      history={props.history}
                    />
                  </>
                ) : (
                  <>
                    <h5>There is no participant for this competition.</h5>
                    <AddButton
                      label={"Participant"}
                      pathname={"/participants/add"}
                      state={{
                        church: church,
                        competition_id: competition._id,
                      }}
                      history={props.history}
                    />
                  </>
                )}
              </div>
            </Tab.Pane>
          );
        });
    }
    // if (church.participants.length > 0) {
    //   return church.participants.map((participant, index) => (
    //     <Tab.Pane key={index + 1} eventKey={index + 1}>
    //       <div className="row">
    //         <h4>{getCompetitionById(participant.competition_id).name}</h4>
    //       </div>
    //     </Tab.Pane>
    //   ));
    // } else {
    //   return <></>;
    // }
  }

  function getCompetitionById(id) {
    return state.competitions.filter((competition) => competition._id == id)[0];
  }

  function onChangeSelectedCategory(e) {
    setSelectedCategory(e.target.value);
  }

  return (
    <div className="participants container">
      <AlertDialog />
      {isApiInProgress ? (
        <Spinner />
      ) : (
        <div className="lander">
          <SelectCategory
            categories={categories}
            selectedCategory={selectedCategory}
            onChangeSelectedCategory={onChangeSelectedCategory}
          />
          <Tab.Container
            id="left-tabs"
            defaultActiveKey="1"
            className="tab-container"
          >
            <Row>
              <Col md={{ span: 10, order: 2 }}>
                <Tab.Content>{participantsList()}</Tab.Content>
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
