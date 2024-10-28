const asyncHandler = require("express-async-handler")
const AdminAuthModel = require('../models/AdminAuthModel')
const UserAuthModel = require("../models/UserAuthModel")
const ActivityLog = require('../models/ActivityLogModel');  // Import the ActivityLog model

// Create User or Admin Based on Role with Logging
const createUserOrAdmin = asyncHandler(async (req, res) => {
  const { username, email, password, userType } = req.body;

  if (!email || !password || !username || !userType) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  let user;
  if (userType === 'Admin') {
    const emailExist = await AdminAuthModel.findOne({ email });
    if (emailExist) {
      res.status(400);
      throw new Error('Admin email already exists');
    }
    user = new AdminAuthModel({ username, email, password });
    await user.save();
    res.status(200).json({ successMsg: 'Admin account created!' });
  } else {
    const emailExist = await UserAuthModel.findOne({ email });
    if (emailExist) {
      res.status(400);
      throw new Error('User email already exists');
    }
    user = new UserAuthModel({ username, email, password });
    await user.save();
    res.status(200).json({ successMsg: 'User account created!' });
  }

  // Log account creation activity
  const log = new ActivityLog({
    userId: user._id,
    userType: userType,
    action: 'Account Created',
    description: `${userType} account for ${username} was created`,
  });
  await log.save();
});

// Admin Sign In with Logging
const adminSignIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const admin = await AdminAuthModel.findOne({ email });

  if (!admin) {
    res.status(404);
    throw new Error("Email doesn't exist! Please sign up first");
  }

  if (admin.password !== password) {
    res.status(400);
    throw new Error('Incorrect password!');
  }

  // Log sign-in activity
  const log = new ActivityLog({
    userId: admin._id,
    userType: 'Admin',
    action: 'Admin Sign-In',
    description: `${admin.username} signed in`,
  });
  await log.save();

  res.json({
    successMsg: 'Sign in successfully!',
    admin,
  });
});

// User Sign In with Logging
const userSignIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const user = await UserAuthModel.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email doesn't exist! Please sign up first");
  }

  if (user.password !== password) {
    res.status(400);
    throw new Error('Incorrect password!');
  }

  // Log sign-in activity
  const log = new ActivityLog({
    userId: user._id,
    userType: 'User',
    action: 'User Sign-In',
    description: `${user.username} signed in`,
  });
  await log.save();

  res.json({
    successMsg: 'Sign in successfully!',
    user,
  });
});


// Get All Users and Admins
const allUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch both users and admins simultaneously
    const [users, admins] = await Promise.all([
      UserAuthModel.find(),  // Fetch all users
      AdminAuthModel.find(), // Fetch all admins
    ]);

    // Check if no users and admins found
    if (!users.length && !admins.length) {
      res.status(404);
      throw new Error('No Users or Admins Found');
    }

    // Combine the users and admins into one response
    const combined = [...users, ...admins]; // Combine users and admins

    // Return combined users and admins
    res.json(combined);
  } catch (error) {
    console.error('Error fetching users and admins:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Delete User or Admin by ID based on Role
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Try to find the user in the UserAuthModel
  let user = await UserAuthModel.findById(userId);

  if (user) {
    // User found, proceed to delete
    await UserAuthModel.findByIdAndDelete(userId);
    return res.status(200).json({ successMsg: 'User deleted successfully' });
  }

  // If not found in UserAuthModel, check AdminAuthModel
  const admin = await AdminAuthModel.findById(userId);
  if (admin) {
    // Admin found, proceed to delete
    await AdminAuthModel.findByIdAndDelete(userId);
    return res.status(200).json({ successMsg: 'Admin deleted successfully' });
  }

  // If neither User nor Admin found, return 404
  res.status(404);
  throw new Error('User or Admin not found');
});

// Update User or Admin by ID based on Role
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  // console.log(username, email,userType)

  if (!username || !email || !role) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Check if userType is Admin or User
  if (role === 'Admin') {
    // Try to find the admin by ID and update
    let admin = await AdminAuthModel.findById(userId);

    if (admin) {
      admin.username = username;
      admin.email = email;

      // Save updated admin details
      await admin.save();
      return res.status(200).json({ successMsg: 'Admin updated successfully' });
    }
  } else {
    // Try to find the user by ID and update
    let user = await UserAuthModel.findById(userId);

    if (user) {
      user.username = username;
      user.email = email;

      // Save updated user details
      await user.save();
      return res.status(200).json({ successMsg: 'User updated successfully' });
    }
  }

  // If neither User nor Admin found, return 404
  res.status(404);
  throw new Error('User or Admin not found');
});
  
module.exports = {
  adminSignIn,
  createUserOrAdmin,
  userSignIn,
  allUsers, deleteUser, updateUser
}