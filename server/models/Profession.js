const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // добавляет два поля в нашу модель: createdAt и updatedAt
  }
)

module.exports = model('Profession', schema)
