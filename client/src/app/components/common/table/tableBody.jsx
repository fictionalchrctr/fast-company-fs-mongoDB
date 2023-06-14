import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

// data = users
// item = user

const TableBody = ({ data, columns }) => {
  const renderContent = (item, column) => {
    if (columns[column].component) {
      const component = columns[column].component
      if (typeof component === 'function') {
        return component(item)
      }
      return component
    }
    return _.get(item, columns[column].path)
  }
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {Object.keys(columns).map((column) => (
            <td key={column}>{renderContent(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.object.isRequired
}

export default TableBody

// const twoDimensionalArray = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ]
// for (let i = 0; i < twoDimensionalArray.length; i++) {
//   for (let j = 0; j < twoDimensionalArray[i].length; j++) {
//     console.log(twoDimensionalArray[i][j])
//   }
// }
