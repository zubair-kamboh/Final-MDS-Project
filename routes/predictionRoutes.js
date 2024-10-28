const router = require('express').Router();

const {
  addPrediction,getPredictions,
  getUserPredictions
} = require('../controllers/predictionController');

// Route for fetching prediction counts
router.get('/counts', getPredictions);

// Route for fetching user-specific predictions
router.get('/:userId', getUserPredictions);

// Route for adding a new prediction
router.post('/', addPrediction);

module.exports = router;
