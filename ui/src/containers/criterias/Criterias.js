import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertDialog, { showDialog } from "../../components/dialogs/Dialog";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";
import { store } from "../../context/Store";
import { deleteCriteriaAction } from "../../context/actions/CompetitionActions";

const Criteria = (props) => (
  <tr>
    <td>{props.criteria.title}</td>
    <td>{props.criteria.value}</td>
    <td>
      <Link
        to={{
          pathname: "/criterias/" + props.criteria._id,
          state: { competition: props.competition },
        }}
      >
        <FontAwesomeIcon icon={faEdit} fixedWidth />
      </Link>
      &nbsp; |
      <Button
        variant="link"
        onClick={() => {
          props.deleteCriteria(props.criteria._id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} fixedWidth />
      </Button>
    </td>
  </tr>
);

export default function Criterias(props) {
  //<Link to={"/criterias/"+props.criteria._id}>Edit</Link> | <a href="#" onClick={() => { props.deleteCriteria(props.criteria._id) }}>Delete</a>
  const [competition, setCompetition] = useState("");
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    if (!props.location.state && !props.match.params.id) {
      toast.warn("Please choose a competition first before proceeding...");
      props.history.push("/competitions");
      return;
    }

    await setCompetition(props.location.state.competition);

    try {
      if (state.competitions.length === 0) {
        //await loadCompetitionsAction(dispatch);
        props.history.push("/competitions");
      }
    } catch (err) {
      toast.error("Loading failed. " + err.message);
      throw err;
    }
  }

  function deleteCriteria(id) {
    showDialog(true, "delete", (res) => {
      res
        .then((proceed) => {
          if (proceed) {
            toast.success("Criteria was deleted successfully!");
            let comp = competition;
            comp.criterias = comp.criterias.filter((cl) => cl._id !== id);
            props.history.push({
              pathname: "/criterias",
              state: {
                competition: comp,
              },
            });

            deleteCriteriaAction(dispatch, competition._id, id).catch((err) => {
              toast.error("Error Deleting this data! " + err.message);
            });
          } else throw new Error("Error");
        })
        .catch((err) => {
          toast.error("Error Deleting this data! " + err.message);
        });
    });
  }

  function criteriaList() {
    let criterias = competition.criterias;
    if (criterias) {
      return criterias.map((currCriteria) => {
        return (
          <Criteria
            competition={competition}
            criteria={currCriteria}
            deleteCriteria={deleteCriteria}
            key={currCriteria._id}
          />
        );
      });
    }
  }

  function computeTotal(competition) {
    let criterias = competition.criterias;
    let totals = 0;
    if (criterias) {
      criterias.map((criteria) => {
        totals += parseFloat(criteria.value);
      });
    }
    return totals;
  }

  return (
    <div className="criterias container">
      <AlertDialog />
      <div className="lander">
        <br />
        <h5>List of Criteria(s) for {competition.name}</h5>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th width={"65%"}>Title</th>
              <th>Percentage (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {criteriaList()}
            <tr>
              <td className="bold">Total</td>
              <td className="bold">{computeTotal(competition)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <AddButton
        label={"Criteria"}
        pathname={"/criterias/add"}
        state={{ competition: competition }}
        history={props.history}
      />
    </div>
  );
}
