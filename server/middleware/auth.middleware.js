const tokenService = require('../services/token.service')

module.exports = (request, response, next) => {
  if (request.method === 'OPTIONS') {
    return next()
  }

  try {
    // Bearer vndkbnvhbvjdgvgvgsdhvgh
    const token = request.headers.authorization.split(' ')[1]
    if (!token) {
      return response.status(401).json({ message: 'Unauthtorized2' })
    }

    const data = tokenService.validateAccess(token)
    console.log(data)
    if (!data) {
      return response.status(401).json({ message: 'Unauthorized3' })
    }
    request.user = data

    next()
  } catch (error) {
    response.status(401).json({ message: 'Unauthorized4' })
  }
}
