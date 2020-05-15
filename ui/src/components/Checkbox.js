import React from "react";
import PropTypes from "prop-types";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

const Checkbox = ({ name, label, onChange, checked }) => {
  return (
    <>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      &nbsp;
      {label}
    </>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default Checkbox;
