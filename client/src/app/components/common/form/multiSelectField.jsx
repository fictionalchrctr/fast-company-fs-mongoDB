import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
  const optionsArray =
    !Array.isArray(options) && typeof options === 'object'
      ? Object.values(options)
      : options
  // console.log('optionsArray', optionsArray)
  const handleChange = (value) => {
    // console.log({ name: name, value })
    onChange({ name, value })
  }
  return (
    <div className='mb-4'>
      <label className='form-label'>{label}</label>
      <Select
        closeMenuOnSelect={false}
        isMulti
        defaultValue={defaultValue}
        options={optionsArray}
        className='basic-multi-select'
        classNamePrefix='select'
        onChange={handleChange}
        name={name}
      />
    </div>
  )
}

MultiSelectField.propTypes = {
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.array
}

export default MultiSelectField
