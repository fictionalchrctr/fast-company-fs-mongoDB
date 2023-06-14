import React from 'react'
import PropTypes from 'prop-types'

const BookMark = ({ status, ...rest }) => {
  return (
    <button className={'btn-sm border-0'} {...rest}>
      <i className={'bi bi-bookmark' + (status ? '-heart-fill' : '')}></i>
    </button>
  )
}
BookMark.propTypes = {
  status: PropTypes.bool
}

export default BookMark
