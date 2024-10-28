const asyncHandler = require("express-async-handler");
const FeedbackModel = require('../models/FeedbackModel');

// Submit feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const { userId, feedback, rating, username } = req.body;
console.log(userId,feedback,rating)
  // Validate input
  if (!userId || !feedback || !rating || !username) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Create a new feedback entry
  const newFeedback = new FeedbackModel({
    userId,
    feedback,
    rating,
    username
  });

  try {
    const savedFeedback = await newFeedback.save();
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: savedFeedback,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to submit feedback");
  }
});

// Get all feedbacks
const getAllFeedbacks = asyncHandler(async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find().populate('userId'); // Populate userId with username
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to load feedbacks");
  }
});

module.exports = {
  submitFeedback,
  getAllFeedbacks,
};
