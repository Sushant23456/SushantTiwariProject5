const mongoose = require('mongoose');
const itemsModel = require('../models/itemsModel');
const {Item} = require('../models/itemsModel');

const formatName = (firstName, lastName) => `${firstName} ${lastName}`;

exports.addItem = async (req, res) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to add items.');
        return res.redirect('/users/login');
    }

    const sellerName = formatName(req.session.user.firstName, req.session.user.lastName);

    const itemData = {
        title: req.body.title,
        seller: sellerName,
        condition: req.body.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        price: req.body.price,
        details: req.body.details,
        image: req.file ? `/uploads/${req.file.filename}` : '',
    };

    try {
        await itemsModel.add(itemData);
        req.flash('success', 'Item added successfully!');
        res.redirect('/items');
    } catch (error) {
        console.error('Error adding new item:', error);
        if (error.name === 'ValidationError') {
            res.status(400).render('error', { message: 'Validation Error: ' + error.message, statusCode: 400 });
        } else {
            res.status(500).render('error', { message: 'Server error while adding new item', statusCode: 500 });
        }
    }
};


exports.updateItem = async (req, res) => {
    const itemId = req.params.itemId;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).render('error', { message: 'Invalid ObjectId format', statusCode: 400 });
    }

    const updatedData = {
        title: req.body.title,
        condition: req.body.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Normalize to match enum values
        price: req.body.price,
        details: req.body.details,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    if (!req.file) {
        delete updatedData.image;
    }

    try {
        const success = await itemsModel.updateById(itemId, updatedData);
        console.log('Update success:', success);
        if (success) {
            req.flash('success', 'Item updated successfully!');
            res.redirect(`/item/${itemId}`);
        } else {
            req.flash('error', 'No changes made or item not found.');
            console.log('No item found or unchanged for ID:', itemId);
            return res.status(404).render('error', { message: 'Item not found or unchanged', statusCode: 404 });
        }
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).render('error', { message: 'Server error during item update', statusCode: 500 });
    }
    
};


exports.deleteItem = async (req, res) => {
    const itemId = req.params.itemId;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).render('error', { message: 'Invalid ObjectId format', statusCode: 400 });
    }

    try {
        const result = await itemsModel.deleteById(itemId);
        if (result && result.deletedCount === 0) {
            return res.status(404).render('error', { message: 'Item not found', statusCode: 404 });
        }
        req.flash('success', 'Item deleted successfully!');
        res.redirect('/items');
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).render('error', { message: 'Server error during item deletion', statusCode: 500 });
    }
};

exports.searchItems = async (req, res) => {
    const searchQuery = req.query.query; 
    if (!searchQuery) {
        req.flash('info', 'Enter a search term to find items.');
        return res.redirect('/items'); 
    }
    try {
        const items = await itemsModel.searchByQuery(searchQuery);
        if (!items.length) {
            req.flash('info', 'No items found matching your search criteria.');
            return res.render('items', { items: [] });
        }
        res.render('items', { items: items });
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).render('error', { message: 'Server error during item search', statusCode: 500 });
    }
};

exports.editItem = async (req, res) => {
    const itemId = req.params.itemId; 
    console.log("Fetching item for edit with ID:", itemId);

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        console.log("Invalid ObjectId format for edit item ID:", itemId);
        return res.status(400).render('error', { message: 'Invalid ObjectId format', statusCode: 400 });
    }

    try {
        const item = await itemsModel.getItemById(itemId);
        if (!item) {
            console.log("Item not found for edit with ID:", itemId);
            return res.status(404).render('error', { message: 'Item not found', statusCode: 404 });
        }
        res.render('edit', { item: item });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).render('error', { message: 'Server error', statusCode: 500 });
    }
};


exports.getItemDetails = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            res.status(404).render('error', { message: 'Item not found' });
            return;
        }

        res.render('item', { item: item, user: req.session.user });
    } catch (error) {
        console.error('Error retrieving item details:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};


