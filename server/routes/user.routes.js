const express = require('express')
const User = require('../models/User')
const router = express.Router({ mergeParams: true })
const auth = require('../middleware/auth.middleware')

router.patch('/:userId', auth, async (request, response) => {
  try {
    const { userId } = request.params

    // userId === current user id
    if (userId) {
      const updatedUser = await User.findByIdAndUpdate(userId, request.body, {
        new: true,
      })
      response.send(updatedUser)
    } else {
      response.status(401).json({
        message: 'Unauthtorized1',
      })
    }
  } catch (error) {
    response.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже!',
    })
  }
})

router.get('/', auth, async (request, response) => {
  try {
    const list = await User.find({})
    response.send(list)
  } catch (error) {
    response.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже!',
    })
  }
})

module.exports = router
