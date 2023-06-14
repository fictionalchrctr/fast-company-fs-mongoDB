const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const cors = require('cors')
const path = require('path')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes/index')

const app = express()
const PORT = config.get('port') ?? 8080

app.use(express.json()) // middleware, позволяющее получать данные с запросов (POST PUT)
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', routes) // middleware, позволяющее обрабатывать остальные запросы

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')))

  const indexPath = path.join(__dirname, 'client', 'index.html')

  app.get('*', (request, response) => {
    response.sendFile(indexPath)
  })
} /* else {
  console.log('Development')
} */

async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase() // при первом соединении к бд
    })
    await mongoose.connect(config.get('mongoUri')) // await потому что вернёт промис
    console.log(chalk.green(`MongoDB connected`))

    app.listen(PORT, () =>
      console.log(chalk.green(`Server has been started on port ${PORT}`))
    )
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1) // 1 - значит произошла какая то ошибка
  }
}

start()
