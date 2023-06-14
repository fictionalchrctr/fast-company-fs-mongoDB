const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    // id того человека, для которого токен актуален
    user: {
      type: Schema.Types.ObjectId, // значением будет уникальный id в mongoDB
      ref: 'User',
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // добавляет два поля в нашу модель: createdAt и updatedAt
  }
)

module.exports = model('Token', schema)
