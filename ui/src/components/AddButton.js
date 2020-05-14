import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddButton = ({ pathname, state, label, history }) => (
  <div>
    <Button
      variant="light"
      size="lg"
      onClick={() =>
        history.push({
          pathname,
          state,
        })
      }
    >
      <FontAwesomeIcon icon={faPlus} /> {label}
    </Button>
  </div>
);

AddButton.propTypes = {
  label: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  state: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default AddButton;
