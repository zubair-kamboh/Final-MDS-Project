const router = require('express').Router();

const { addFAQ, getAllFAQ, upvoteDownVote } = require('../controllers/faqControllers');
const {
  getTotalScans
} = require('../controllers/statsController');

router.post('/add', addFAQ);
router.get('/', getAllFAQ);
router.put('/vote/:id', upvoteDownVote);

module.exports = router;
