const express = require('express')
const auth = require('../middleware/auth.middleware')
const Comment = require('../models/Comment')
const router = express.Router({ mergeParams: true })

// /api/comment
router
  .route('/')
  .get(auth, async (request, response) => {
    try {
      // console.log('request.query', request.query)
      const { orderBy, equalTo } = request.query
      const list = await Comment.find({ [orderBy]: equalTo })
      response.send(list)
    } catch (error) {
      response.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже! 1',
      })
    }
  })
  .post(auth, async (request, response) => {
    try {
      const newComment = await Comment.create({
        ...request.body,
        userId: request.user._id,
      })
      response.status(201).send(newComment)
    } catch (error) {
      response.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже! 2',
      })
    }
  })

// /api/comment/:id
router.delete('/:commentId', auth, async (request, response) => {
  try {
    const { commentId } = request.params
    // const removedComment = await Comment.find({ _id: commentId }) // ===
    const removedComment = await Comment.findById(commentId)

    // удалять комментарии может тот пользователь, кто оставлял
    if (removedComment.userId.toString() === request.user._id) {
      await removedComment.deleteOne()
      return response.send(null)
    } else {
      response.status(401).json({ message: 'Unauthtorized1' })
    }
  } catch (error) {
    console.log(error.message)
    response.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже! 33',
    })
  }
})

module.exports = router
