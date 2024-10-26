import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'react-bootstrap';

const MultiSelectDropdown = ({ options, selectedOptions, onChange, title }) => {
  const [show, setShow] = useState(false);

  const handleToggle = (isOpen) => setShow(isOpen);

  const handleCheckboxChange = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  return (
    <Dropdown show={show} onToggle={handleToggle} className="mb-3">
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option, index) => (
          <Form.Check
            key={index}
            type="checkbox"
            id={`checkbox-${option._id}`}
            label={option.process_name}
            checked={selectedOptions.includes(option.process_name)}
            onChange={() => handleCheckboxChange(option.process_name)}
            className="mx-3"
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

// Define prop types
MultiSelectDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

// Optional: Define default props
MultiSelectDropdown.defaultProps = {
  options: [],
  selectedOptions: [],
  title: 'Select Options'
};

export default MultiSelectDropdown;
