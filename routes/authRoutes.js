const router = require('express').Router();

const {
  adminSignIn,
  userSignIn,
  allUsers,
  deleteUser,
  createUserOrAdmin, updateUser
} = require('../controllers/authController');

router.post('/createUserOrAdmin', createUserOrAdmin);
router.post('/admin/signin', adminSignIn);
router.post('/user/signin', userSignIn);
router.get('/users', allUsers);
router.delete('/users/:id', deleteUser); 
router.put('/users/:id', updateUser);

module.exports = router;
