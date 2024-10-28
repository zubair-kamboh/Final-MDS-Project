const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
      },
    role: {
      type: String,
      default: 'User',
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)