const express = require('express');
const router = express.Router({ mergeParams: true }); // to access params from parent router
const offersController = require('../controllers/offersController');
const { isLoggedIn, isSeller } = require('../middleware/auth');


router.post('/:itemId/add', isLoggedIn,(req, res, next) => {
    next();
  }, offersController.makeOffer);
  
  router.get('/:itemId/offers', isLoggedIn, (req, res, next) => {
    console.log("Route /:itemId/offers accessed with Item ID:", req.params.itemId);
    next();
}, isSeller, offersController.viewOffers);

router.post('/:itemId/offers/accept/:offerId', isLoggedIn, isSeller, offersController.acceptOffer);


router.get('/offers', offersController.viewOffers);

module.exports = router;
