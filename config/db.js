const mongoose = require('mongoose')

const connection = async () => {
  try {
    const connection = await mongoose.connect(
      'mongodb://127.0.0.1:27017/MalwareDetectionSystem',
      {
        // useNewUrlParser: true,
      }
    )

    if (connection) {
      console.log('db connected')
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = connection