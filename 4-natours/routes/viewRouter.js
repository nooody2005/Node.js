const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');



router.get('/',viewsController.getOverview);
router.get('/tour/:slug',authController.protect,viewsController.getTour);

// LOGIN
router.get('/login',viewsController.getLoginForm);

module.exports = router;


























//====================================================================
// router.get('/', (req ,res ) => {
//   res.status(200).render('base', {
//     //get in base file that existed in views folder
//     tour: 'The Forest Hiker',
//     user: 'Nada'
//   });    
// });