const express = require('express')
const Profession = require('../models/Profession')
const router = express.Router({ mergeParams: true })

router.get('/', async (request, response) => {
  try {
    const list = await Profession.find()
    response.status(200).send(list)
  } catch (error) {
    response.status(500).json({
      message: 'На сервере произощла ошибка. Попробуйте позже',
    })
  }
})

module.exports = router
