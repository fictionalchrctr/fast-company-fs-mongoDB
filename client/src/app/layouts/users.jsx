import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, Redirect } from 'react-router-dom'
import EditUserPage from '../components/page/editUserPage'
import UserPage from '../components/page/userPage'
import UsersListPage from '../components/page/usersListPage'
import UsersLoader from '../components/ui/hoc/usersLoader'
import { getCurrenUserId } from '../store/users'

const Users = () => {
  const params = useParams()
  const userId = params.userId
  const edit = params.edit
  const currentUserId = useSelector(getCurrenUserId())

  return (
    <>
      <UsersLoader>
        {userId ? (
          edit ? (
            userId === currentUserId ? (
              <EditUserPage />
            ) : (
              <Redirect to={`/users/${currentUserId}/edit`} />
            )
          ) : (
            <UserPage userId={userId} />
          )
        ) : (
          <UsersListPage />
        )}
      </UsersLoader>
    </>
  )
}

export default Users