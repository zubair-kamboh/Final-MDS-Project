const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true }, // Added username field
  feedback: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically store the timestamp
});

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
module.exports = FeedbackModel;
