const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');


// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me',authController.protect,viewsController.getAccount);
router.post('/submit-user-data',authController.protect, viewsController.updateUserData);

module.exports = router;













































//====================================================================
// router.get('/', (req ,res ) => {
//   res.status(200).render('base', {
//     //get in base file that existed in views folder
//     tour: 'The Forest Hiker',
//     user: 'Nada'
//   });    
// });