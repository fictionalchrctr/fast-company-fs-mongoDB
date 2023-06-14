const express = require('express')
const router = express.Router({ mergeParams: true })

// /api/auth
router.use('/auth', require('./auth.routes'))

// /api/comment
router.use('/comment', require('./comment.routes'))

// /api/quality
router.use('/quality', require('./quality.routes'))

// /api/profession
router.use('/profession', require('./profession.routes'))

// /api/user
router.use('/user', require('./user.routes'))

module.exports = router
