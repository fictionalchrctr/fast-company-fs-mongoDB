const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    content: { type: String, required: true },
    // на чьей странице находится комментарий:
    pageId: {
      type: Schema.Types.ObjectId, // значением будет уникальный id в mongoDB
      ref: 'User',
      required: true,
    },
    // кто оставил комментарий
    userId: {
      type: Schema.Types.ObjectId, // значением будет уникальный id в mongoDB
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at' }, // добавляет два поля в нашу модель: createdAt и updatedAt
  }
)

module.exports = model('Comment', schema)
