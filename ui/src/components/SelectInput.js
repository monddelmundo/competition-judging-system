import React from "react";
import PropTypes from "prop-types";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

const SelectInput = ({
  name,
  label,
  onChange,
  defaultOption,
  value,
  options,
}) => {
  return (
    <FormGroup controlId="participants">
      <FormLabel>{label}</FormLabel>
      <FormControl as="select" name={name} value={value} onChange={onChange}>
        <option value="">{defaultOption}</option>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </FormControl>
    </FormGroup>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultOption: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object),
};

export default SelectInput;
