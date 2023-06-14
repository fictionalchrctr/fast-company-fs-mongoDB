import React from 'react'
import PropTypes from 'prop-types'

const SearchStatus = ({ length }) => {
  const renderPhrase = (number) => {
    if (number > 4 && number < 15) return 'человек тусанет'
    if (number <= 4 && number >= 2) return 'человека тусанут'
    if (number === 1) return 'человек тусанет'
    return 'человек тусанет'
  }
  return (
    <>
      <h2>
        <span className={'badge ' + (length > 0 ? 'bg-primary' : 'bg-danger')}>
          {length > 0
            ? `${length + ' ' + renderPhrase(length)} с тобой сегодня`
            : 'Никто с тобой не тусанет'}
        </span>
      </h2>
    </>
  )
}
SearchStatus.propTypes = {
  length: PropTypes.number.isRequired
}

export default SearchStatus
