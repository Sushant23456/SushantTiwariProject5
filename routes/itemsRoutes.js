const express = require('express');
const router = express.Router();
const multer = require('multer');
const itemsController = require('../controllers/itemsController');
const { isLoggedIn, isSeller } = require('../middleware/auth');
const itemsModel = require('../models/itemsModel');
const upload = multer({ dest: 'uploads/' });

router.get('/search', itemsController.searchItems);

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new');
});

router.post('/add', isLoggedIn, upload.single('image'), itemsController.addItem);

router.get('/edit/:itemId', isLoggedIn, (req, res, next) => {
    console.log("Edit route hit with Item ID:", req.params.itemId);
    next();
}, isSeller, itemsController.editItem);

router.post('/update/:itemId', isLoggedIn, isSeller, upload.single('image'), itemsController.updateItem);
router.post('/delete/:itemId', isLoggedIn, (req, res, next) => {
    console.log("Delete route hit with Item ID:", req.params.itemId);
    next();
}, isSeller, itemsController.deleteItem);


router.get('/', async (req, res) => {
    try {
        let allItems = await itemsModel.getAll();
        allItems = allItems.sort((a, b) => a.price - b.price);
        console.log("Fetched items:", allItems); 
        res.render('items', { items: allItems });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).render('error', { message: 'Error fetching items' });
    }
});


router.get('/:id', itemsController.getItemDetails);



module.exports = router;