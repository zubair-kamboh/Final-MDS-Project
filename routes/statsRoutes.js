const router = require('express').Router();

const {
  getUserStats,
  getTotalScans
} = require('../controllers/statsController');

router.get('/users/stats', getUserStats);
router.get('/totalscans', getTotalScans);

module.exports = router;
