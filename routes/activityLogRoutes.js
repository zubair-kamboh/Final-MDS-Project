const router = require('express').Router();

const {getActivityLogs, logActivity } = require('../controllers/activityLogController');

router.post('/', logActivity);
router.get('/', getActivityLogs);

module.exports = router;
