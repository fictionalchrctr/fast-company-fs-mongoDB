const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    completedMeetings: { type: Number },
    image: { type: String },
    profession: {
      type: Schema.Types.ObjectId, // значением будет уникальный id в mongoDB
      ref: 'Profession',
    },
    qualities: [
      {
        type: Schema.Types.ObjectId, // значением будет уникальный id в mongoDB
        ref: 'Quality',
      },
    ],
    rate: { type: Number },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
  },
  {
    timestamps: true, // добавляет два поля в нашу модель: createdAt и updatedAt
  }
)

module.exports = model('User', schema)
