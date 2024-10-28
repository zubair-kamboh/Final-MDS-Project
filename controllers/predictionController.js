const asyncHandler = require('express-async-handler');
const UrlModel = require('../models/URLModel');
const ActivityLogModel = require('../models/ActivityLogModel');
const mongoose = require('mongoose')

const addPrediction = asyncHandler(async (req, res) => {
  const { predictions, userId, userType } = req.body; // Accept predictions, userId, and userType from req.body

  if (!predictions || predictions.length === 0) {
    res.status(400);
    throw new Error('No predictions provided');
  }

  if (!userId || !userType) {
    res.status(400);
    throw new Error('User information is missing');
  }

  // Create a new entry with all the predictions
  const urlEntry = new UrlModel({
    predictions, // Array of { url, prediction } objects
    addedBy: userId,
    userType: userType,
  });

  try {
    const savedEntry = await urlEntry.save(); // Save the new document
    res.status(201).json({ message: 'Predictions added successfully!' });
    
      // Log malware prediction activity
    const log = new ActivityLogModel({
      userId,
      userType,
      action: 'Malware Prediction',
      description: `${userType} with ID ${userId} made a malware prediction`,
    });
    await log.save();
  } catch (error) {
    res.status(500);
    throw new Error('Failed to save predictions');
  }
});

const getUserPredictions = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
  }

  try {
      const userPredictions = await UrlModel.find({ addedBy: userId });

      if (!userPredictions || userPredictions.length === 0) {
          return res.status(404).json({ message: 'No predictions found for this user' });
      }

      res.status(200).json(userPredictions);
  } catch (error) {
      console.error('Error fetching user predictions:', error);
      res.status(500).json({ message: 'Failed to fetch predictions' });
  }
});




const getPredictions = asyncHandler(async (req, res) => {
  try {
      const counts = await UrlModel.aggregate([
          { $unwind: "$predictions" },
          {
              $group: {
                  _id: "$predictions.prediction",
                  count: { $sum: 1 }
              }
          }
      ]);

      const result = {
          benign: 0,
          defacement: 0,
          phishing: 0,
          malware: 0,
      };

      counts.forEach(item => {
          result[item._id] = item.count; // Assign counts to the appropriate keys
      });

      console.log('Counts:', counts); // Log counts for debugging
      res.json(result);
  } catch (error) {
      console.error('Error fetching prediction counts:', error);
      res.status(500).json({ detail: 'Internal server error' });
  }
});

  

module.exports = { addPrediction,getPredictions, getUserPredictions };
