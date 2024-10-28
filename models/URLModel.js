const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    required: true,
  },
});

const urlSchema = new mongoose.Schema(
  {
    predictions: [predictionSchema], // Array of prediction objects (url, prediction)
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userType', // Dynamic reference based on userType
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ['Admin', 'User'], // Can reference either Admin or User model
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);

module.exports = mongoose.model('Url', urlSchema);
