import React, { useState } from 'react'
// import API from '../../../api'
// import SelectField from '../form/selectField'
import TextAreaField from '../form/textAreaField'
import { validator } from '../../../utils/validator'
import PropTypes from 'prop-types'

const AddCommentForm = ({ onSubmit }) => {
  const [data, setData] = useState({})
  // const [users, setUsers] = useState({}) // получаем юзеров для того чтобы отображать кто будет писать данный комментарий
  const [errors, setErrors] = useState({})
  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }))
  }
  const validatorConfig = {
    content: {
      isRequired: {
        message: 'Сообщение не может быть пустым'
      }
    }
  }

  const validate = () => {
    const errors = validator(data, validatorConfig)
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  // useEffect(() => {
  //   API.users
  //     .fetchAll() // получаем всех пользователей
  //     .then(setUsers) // устанавливаем пользователй в users
  // }, [])

  const clearForm = () => {
    setData({})
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validate()
    if (!isValid) return
    onSubmit(data)
    clearForm()
  }

  // const arrayOfUsers =
  //   users &&
  //   Object.keys(users).map((userId) => ({
  //     label: users[userId].name,
  //     value: users[userId]._id
  //   }))

  return (
    <div>
      <h2>New comment</h2>
      <form onSubmit={handleSubmit}>
        {/* <SelectField
          onChange={handleChange}
          options={arrayOfUsers}
          name='userId'
          value={data.userId}
          defaultOption='Выберите пользователя'
          error={errors.userId}
        /> */}
        <TextAreaField
          value={data.content || ''}
          onChange={handleChange}
          name='content'
          label='Сообщение'
          error={errors.content}
        />
        <div className='d-flex justify-content-end'>
          <button className='btn btn-primary'>Опубликовать</button>
        </div>
      </form>
    </div>
  )
}
AddCommentForm.propTypes = {
  onSubmit: PropTypes.func
}

export default AddCommentForm
