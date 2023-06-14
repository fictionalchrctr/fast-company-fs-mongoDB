const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // добавляет createdAt и updatedAt
  }
)

module.exports = model('Quality', schema)
