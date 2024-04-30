const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn, guestOnly } = require('../middleware/auth'); 

router.get('/login', guestOnly, userController.showLogin);
router.post('/login', guestOnly, userController.login);

router.get('/new', guestOnly, userController.showNew);
router.post('/new', guestOnly, userController.new);

router.get('/profile', isLoggedIn, userController.showProfile);
router.get('/logout', isLoggedIn, userController.logout);



module.exports = router;
