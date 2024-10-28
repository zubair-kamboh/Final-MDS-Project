const mongoose = require('mongoose');

// Define the ActivityLog schema
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType', // Use dynamic referencing for user/admin
  },
  userType: {
    type: String,
    required: true,
    enum: ['User', 'Admin'],
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Export the ActivityLog model
module.exports = mongoose.model('ActivityLog', activityLogSchema);
