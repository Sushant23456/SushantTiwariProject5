const itemsModel = require('../models/itemsModel');


exports.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in to view this page.');
        return res.redirect('/users/login');
    }
};


exports.guestOnly = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in.');
        res.redirect('/users/profile');
    }
};

const formatName = (firstName, lastName) => {
    return `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
};

exports.isSeller = async (req, res, next) => {
    console.log("Attempting to verify seller with Item ID:", req.params.itemId);

    const itemId = req.params.itemId;

    try {
        const item = await itemsModel.getItemById(itemId);
        if (!item) {
            console.log(`No item found with ID: ${itemId}`);  // Log if no item found
            return res.status(404).render('error', {
                message: 'Item not found',
                statusCode: 404
            });
        }

        console.log(`Fetched item:`, item);  // Log the fetched item details

        const sellerName = formatName(req.session.user.firstName, req.session.user.lastName);
        const itemName = item.seller.toLowerCase().trim();

        console.log(`Formatted seller name: ${sellerName}`);  // Log formatted seller name
        console.log(`Item seller name: ${itemName}`);  // Log item seller name

        if (sellerName === itemName) {
            console.log("Authorization successful. Proceeding to next middleware.");  // Log successful authorization
            return next();
        } else {
            console.log("Authorization failed. User is not the seller.");  // Log failed authorization
            res.status(401).render('error', {
                message: 'Unauthorized: You do not have permission to perform this action.',
                statusCode: 401
            });
        }
    } catch (error) {
        console.error('Authorization error:', error);  // Log any caught errors
        res.status(500).render('error', {
            message: 'Server error',
            statusCode: 500
        });
    }
};



// const formatName = (firstName, lastName) => `${firstName.trim()} ${lastName.trim()}`.toLowerCase();

// exports.isSeller = async (req, res, next) => {
//     const itemId = req.params.itemId;
//     try {
//         const item = await itemsModel.getItemById(itemId);
//         if (!item) {
//             return res.status(404).render('error', {
//                 message: 'Item not found',
//                 statusCode: 404
//             });
//         }

//         const sellerName = formatName(req.session.user.firstName, req.session.user.lastName);
//         const itemName = item.seller.toLowerCase().trim();

//         if (sellerName === itemName) {
//             return next();
//         } else {
//             res.status(401).render('error', {
//                 message: 'Unauthorized: You do not have permission to perform this action.',
//                 statusCode: 401
//             });
//         }
//     } catch (error) {
//         console.error('Authorization error:', error);
//         res.status(500).render('error', {
//             message: 'Server error',
//             statusCode: 500
//         });
//     }
// };




// exports.isNotSeller = async (req, res, next) => {
//     try {
//         const itemId = req.params.id;
//         const item = await itemsModel.getItemById(itemId);
//         if (!item) {
//             return res.status(404).render('error', {
//                 message: 'Item not found',
//                 statusCode: 404
//             });
//         }

//         const sellerName = formatName(req.session.user.firstName, req.session.user.lastName);
        
//         if (sellerName !== item.seller) {
//             return next();
//         } else {
//             res.status(401).render('error', {
//                 message: 'Unauthorized: You are the seller of this item and cannot perform this action.',
//                 statusCode: 401
//             });
//         }
//     } catch (error) {
//         console.error('Authorization error:', error);
//         res.status(500).render('error', {
//             message: 'Server error',
//             statusCode: 500
//         });
//     }
// };











