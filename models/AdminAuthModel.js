const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
      },
    role: {
      type: String,
      default: 'Admin',
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

module.exports = mongoose.model('Admin', AdminSchema)