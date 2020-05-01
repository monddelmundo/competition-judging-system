import React from "react";
import PropTypes from "prop-types";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

const TextInput = ({ name, label, onChange, placeholder, value }) => {
  return (
    <FormGroup controlId="title">
      <FormLabel>{label}</FormLabel>
      <FormControl
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </FormGroup>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default TextInput;
