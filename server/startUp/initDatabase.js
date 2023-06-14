// 1. У любого пользователя в бд будет как минимум qualities & professions
// 2. Они равны mock данным

const Profession = require('../models/Profession')
const Quality = require('../models/Quality')
const professionMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')

module.exports = async () => {
  const professions = await Profession.find() // проверяем какие профессии присутствуют в БД
  if (professions.length !== professionMock.length) {
    await createInitialEntity(Profession, professionMock)
  }

  const qulities = await Quality.find() // проверяем какие качества присутствуют в БД
  if (qulities.length !== qualitiesMock.length) {
    await createInitialEntity(Quality, qualitiesMock)
  }
}

// Создаём начальную сущность
async function createInitialEntity(Model, data) {
  await Model.collection.drop() // чистим например Profession или Qualitiy
  return Promise.all(
    // сохраняем каждый элемент(item), который есть в mock данных
    data.map(async (item) => {
      try {
        delete item._id
        const newItem = new Model(item)
        await newItem.save() // метод save берёт локально записанные данные и заносит в mongoDB
        return newItem
      } catch (error) {
        return error
      }
    })
  )
}
