const expressAsyncHandler = require("express-async-handler");
const URLModel = require('../models/URLModel'); // Import your URL model
const UserModel = require('../models/UserAuthModel'); // Import your User model
const AdminModel = require('../models/AdminAuthModel'); // Import your Admin model

const getUserStats = expressAsyncHandler(async (req, res) => {
    try {
        // Fetch all users and admins
        const [users, admins] = await Promise.all([
            UserModel.find(),
            AdminModel.find(),
        ]);

        // Combine users and admins into one array
        const combinedUsers = [...users, ...admins];

        // Prepare the results array
        const results = await Promise.all(combinedUsers.map(async (user) => {
            const urls = await URLModel.find({ addedBy: user._id });

            // Calculate the number of URLs scanned and threats detected
            const urlsScanned = urls.length;
            const threatsDetected = urls.reduce((acc, urlEntry) => {
                // Check the predictions array for threat types
                return acc + urlEntry.predictions.filter(pred => 
                    ['defacement', 'phishing', 'malware'].includes(pred.prediction)
                ).length;
            }, 0);

            // Return user data along with calculated stats
            return {
                username: user.username,
                registered: user.createdAt, // Assuming 'createdAt' is a timestamp field in the User model
                totalScans: urlsScanned,
                threatsDetected,
                userType: user.role || 'User', 
            };
        }));

        // Send the response with user stats
        res.json(results);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

// Fetch scan statistics
const getTotalScans = expressAsyncHandler(async (req, res) => {
    try {
        // Fetch all users and admins
        const [users, admins] = await Promise.all([
            UserModel.find(),
            AdminModel.find(),
        ]);

        // Combine users and admins into one array
        const combinedUsers = [...users, ...admins];

        // Prepare the results array
        const results = await Promise.all(combinedUsers.map(async (user) => {
            // Fetch URLs associated with the current user
            const urls = await URLModel.find({ addedBy: user._id });

            // Calculate the total scans and threats detected
            const totalScans = urls.length;
            const totalThreats = urls.reduce((acc, urlEntry) => {
                return acc + urlEntry.predictions.filter(pred => 
                    ['defacement', 'phishing', 'malware'].includes(pred.prediction)
                ).length;
            }, 0);

            // Group scans by timeframes
            const scansHourly = urls.filter(url => {
                const date = new Date(url.createdAt);
                return date >= new Date(Date.now() - 60 * 60 * 1000); // Last hour
            }).length;

            const scansDaily = urls.filter(url => {
                const date = new Date(url.createdAt);
                return date >= new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
            }).length;

            const scansWeekly = urls.filter(url => {
                const date = new Date(url.createdAt);
                return date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last week
            }).length;

            const scansMonthly = urls.filter(url => {
                const date = new Date(url.createdAt);
                return date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last month
            }).length;

            // Return user data along with calculated stats
            return {
                username: user.username, // Assuming 'username' is a field in your User model
                registered: user.createdAt, // Assuming 'createdAt' is a timestamp field in the User model
                totalScans,
                threatsDetected: totalThreats,
                userType: user.role || 'User', // Default to 'User' if no role field exists
                scansHourly,
                scansDaily,
                scansWeekly,
                scansMonthly,
            };
        }));

        // Send the response with user stats
        res.json({
            scans: results,
            totalThreats: results.reduce((acc, curr) => acc + curr.threatsDetected, 0), // Calculate total threats across all users
        });
    } catch (error) {
        console.error('Error fetching scan stats:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

module.exports = { getUserStats,getTotalScans };
