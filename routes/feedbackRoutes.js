const express = require('express');
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');

const router = express.Router();

// Route for submitting feedback
router.post('/', submitFeedback);

// Route for getting all feedbacks
router.get('/', getAllFeedbacks);

module.exports = router;
