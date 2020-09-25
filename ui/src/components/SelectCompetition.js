import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";

export const SelectCompetition = ({
  competitions,
  selectedCompetition,
  onChangeSelectedCompetition,
}) => {
  return (
    <FormGroup>
      <br />
      <h5>Choose Competition</h5>
      <FormControl
        autoFocus
        as="select"
        value={selectedCompetition}
        onChange={onChangeSelectedCompetition}
      >
        {competitions.map(function (competition) {
          return (
            <option key={competition.key} value={competition.key}>
              {competition.value}
            </option>
          );
        })}
      </FormControl>
    </FormGroup>
  );
};

SelectCompetition.propTypes = {
  competitions: PropTypes.array.isRequired,
  selectedCompetition: PropTypes.string.isRequired,
  onChangeSelectedCompetition: PropTypes.func.isRequired,
};

export default SelectCompetition;
