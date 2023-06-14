import React, { useState, useEffect } from 'react'
import { paginate } from '../../../utils/paginate'
import Pagination from '../../common/pagination'
import GroupList from '../../common/groupList'
import PropTypes from 'prop-types'
import SearchStatus from '../../ui/searchStatus'
import UsersTable from '../../ui/usersTable'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import {
  getProfessions,
  getProfessionsLoadingStatus
} from '../../../store/professions'
import { getCurrenUserId, getUsersList } from '../../../store/users'

const UsersListPage = () => {
  const users = useSelector(getUsersList())
  const currentUserId = useSelector(getCurrenUserId())

  const professions = useSelector(getProfessions())
  const professionsLoading = useSelector(getProfessionsLoadingStatus())

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProf, setSelectedProf] = useState()
  const [sortBy, setSortBy] = useState({ path: 'name', order: 'asc' })

  const pageSize = 8 // по pageSize пользователя на каждой странице

  // const handleDelete = (userId) => {
  //   // setUsers(users.filter((user) => user._id !== userId))
  //   console.log('handleDelete', userId)
  // }

  const handleToggleBookmark = (userId) => {
    const newArray = users.map((user) => {
      if (user._id === userId) {
        return { ...user, bookmark: !user.bookmark }
      }
      return user
    })
    // setUsers(newArray)
    console.log('handleToggleBookmark:', newArray)
  }

  // useEffect вызывается каждый раз когда мы монтируем что-то в DOM
  // хук useEffect нужен для отслеживания различных этапов компонента (монтирование в DOM, изменение, удаление)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedProf, searchQuery])

  // внутри [] может быть параметр за которым необходимо наблюдать
  // если [] присутствует, то функция внутри useEffect вызывается один раз при первом монтировании компонента в DOM
  // если [] отстутствует, то функция внутри useEffect вызывается каждый раз при обновлении/изменении компонента

  const handleProffesionSelect = (item) => {
    if (searchQuery !== '') setSearchQuery('')
    setSelectedProf(item)
  }

  const handleSearchQuery = (event) => {
    setSelectedProf(undefined)
    setSearchQuery(event.target.value)
  }

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  const handleSort = (item) => {
    setSortBy(item)
  }

  console.log('users', users)

  function filterUsers(data) {
    const filteredUsers = searchQuery
      ? data.filter(
          (user) =>
            user.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
        )
      : selectedProf
      ? data.filter((user) => user.profession === selectedProf._id)
      : data
    return filteredUsers.filter((user) => user._id !== currentUserId)
  } // отображение всех пользователей кроме текущего

  const filteredUsers = filterUsers(users)
  const count = filteredUsers.length
  const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order])
  const userCrop = paginate(sortedUsers, currentPage, pageSize) // разбиение пользователей на страницы
  const clearFilter = () => {
    setSelectedProf()
  }

  return (
    <div className='d-flex'>
      {professions && !professionsLoading && (
        <div className='d-flex flex-column flex-shrink-0 p-3'>
          <GroupList
            selectedItem={selectedProf}
            items={professions}
            onItemSelect={handleProffesionSelect}
          />
          <button className='btn btn-secondary mt-2' onClick={clearFilter}>
            {' '}
            Сброс{' '}
          </button>
        </div>
      )}
      <div className='d-flex flex-column'>
        <SearchStatus length={count} />
        <input
          type='text'
          name='searchQuery'
          placeholder='Search...'
          onChange={handleSearchQuery}
          value={searchQuery}
        />
        {count > 0 && (
          <UsersTable
            onSort={handleSort}
            users={userCrop}
            selectedSort={sortBy}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        <div className='d-flex justify-content-center'>
          <Pagination
            itemsCount={count}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
UsersListPage.propTypes = {
  users: PropTypes.array
}

export default UsersListPage
