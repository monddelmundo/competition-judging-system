import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";

export const SelectEvent = ({
  events,
  selectedEvent,
  onChangeSelectedEvent,
  handleViewBtn,
}) => {
  return (
    <FormGroup>
      <br />
      <h5>Choose Event</h5>
      <FormControl
        autoFocus
        as="select"
        value={selectedEvent}
        onChange={onChangeSelectedEvent}
      >
        {events.map(function (event) {
          return (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          );
        })}
      </FormControl>
      <br />
      <button className="btn btn-dark" onClick={handleViewBtn}>
        View
      </button>
    </FormGroup>
  );
};

SelectEvent.propTypes = {
  events: PropTypes.array.isRequired,
  selectedEvent: PropTypes.string.isRequired,
  onChangeSelectedEvent: PropTypes.func.isRequired,
  handleViewBtn: PropTypes.func.isRequired,
};

export default SelectEvent;
