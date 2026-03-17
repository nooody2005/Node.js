const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
//define router 
const router = express.Router();

//make routes
router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
