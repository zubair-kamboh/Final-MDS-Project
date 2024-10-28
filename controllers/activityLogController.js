const asyncHandler = require('express-async-handler');
const ActivityLog = require('../models/ActivityLogModel');

const logActivity = asyncHandler(async (req, res) => {
    const {userId, userType, action, details} = req.body
    try {
        const activity = new ActivityLog({
          userId,
          userType,
          action,
          details,
        });
        await activity.save();
      } catch (error) {
        console.error('Error logging activity:', error);
      }
  });

// Get Activity Logs
const getActivityLogs = asyncHandler(async (req, res) => {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }); // Sort by latest activities
  console.log(logs)
    if (!logs) {
      res.status(404);
      throw new Error('No activity logs found');
    }
  
    res.status(200).json(logs);
  });

module.exports = {logActivity, getActivityLogs};
