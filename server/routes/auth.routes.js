const express = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const { generateUserData } = require('../utils/helpers')
const tokenService = require('../services/token.service')
const router = express.Router({ mergeParams: true })

// /api/auth/signUp
// 1. получить данные из requesta (email, password, etc..)
// 2. проверить. существует ли пользователь
// 3. создать захэшированный пароль
// 4. создать пользователя
// 5. генерация токенов

// const signUpValidations = [
//   check('email', 'Некорректный email').isEmail(),
//   check('password', 'Минимальная длинна пароля 8 символов').isLength({
//     min: 8,
//   }),
// ]

router.post('/signUp', [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длинна пароля 8 символов').isLength({
    min: 8,
  }),
  async (request, response) => {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return response.status(400).json({
          error: {
            message: 'INVALID DATA',
            code: 400,
            // errors: errors.array(),
          },
        })
      }
      const { email, password } = request.body // здесь хранятся данные, отправляемые с методом Post
      const existingUser = await User.findOne({ email }) // в коллекции пользователей ищем одного пользователя, у которого email соответствует тому, который мы передавали по запросу. И если он найден, то этот email уже занят
      if (existingUser) {
        // выдаём ошибку на клиент
        return response.status(400).json({
          error: {
            message: 'EMAIL_EXISTS',
            code: 400,
          },
        })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const newUser = await User.create({
        ...generateUserData(),
        ...request.body,
        password: hashedPassword,
      })
      const tokens = tokenService.generate({ _id: newUser._id })

      await tokenService.save(newUser._id, tokens.refreshToken)

      response.status(201).send({ ...tokens, userId: newUser._id })
    } catch (error) {
      response.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже!',
      })
    }
  },
])

// /api/auth/signInWithPassword
// 1. Валидируем входящие данные
// 2. Найти пользователя
// 3. Сравнить hashed passwords
// 4. Генерация токенов
// 5. Вернуть все необходимые данные

router.post('/signInWithPassword', [
  check('email', 'Некорректный email').normalizeEmail().isEmail(),
  check('password', 'Пароль ен должен быть пустым').exists(),

  async (request, response) => {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return response.status(400).json({
          error: {
            message: 'INVALID DATA',
            code: 400,
            // errors: errors.array(),
          },
        })
      }

      const { email, password } = request.body

      const existingUser = await User.findOne({ email }) // в коллекции пользователей ищем одного пользователя, у которого email соответствует тому, который мы передавали по запросу. И если он найден, то этот email уже занят

      if (!existingUser) {
        // выдаём ошибку на клиент
        return response.status(400).json({
          error: {
            message: 'EMAIL_NOT_FOUND',
            code: 400,
          },
        })
      }

      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password
      )
      if (!isPasswordEqual) {
        return response.status(400).json({
          error: {
            message: 'INVALID_PASSWORD',
            code: 400,
          },
        })
      }

      const tokens = tokenService.generate({ _id: existingUser._id })

      await tokenService.save(existingUser._id, tokens.refreshToken)

      response.status(200).send({ ...tokens, userId: existingUser._id })
    } catch (error) {
      response.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже!',
      })
    }
  },
])

// refreshToken
// /api/auth/token
function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString()
}

router.post('/token', async (request, response) => {
  try {
    const { refresh_token: refreshToken } = request.body
    // корректный ли refreshToken ->
    const data = tokenService.validateRefresh(refreshToken) // в data id того пользователя, к которому прикреплён этот refreshToken
    const dbToken = await tokenService.findToken(refreshToken)
    if (isTokenInvalid(data, dbToken)) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
    // если if не выполнился, то нужно обновить все токены
    const tokens = tokenService.generate({ _id: data._id })
    await tokenService.save(data._id, tokens.refreshToken)

    response.status(200).send({ ...tokens, userId: data._id })
  } catch (error) {
    response.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже!',
    })
  }
})

module.exports = router
