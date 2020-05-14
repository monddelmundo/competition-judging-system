import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";

export const SelectCategory = ({
  categories,
  selectedCategory,
  onChangeSelectedCategory,
}) => {
  return (
    <FormGroup>
      <br />
      <h5>Choose Category</h5>
      <FormControl
        autoFocus
        as="select"
        value={selectedCategory}
        onChange={onChangeSelectedCategory}
      >
        {categories.map(function (category) {
          return (
            <option key={category.key} value={category.key}>
              {category.value}
            </option>
          );
        })}
      </FormControl>
    </FormGroup>
  );
};

SelectCategory.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onChangeSelectedCategory: PropTypes.func.isRequired,
};

export default SelectCategory;
