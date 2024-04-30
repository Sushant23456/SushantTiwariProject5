// const { body, validationResult } = require('express-validator');

// exports.newItemValidationRules = () => [
//     body('title').trim().notEmpty().withMessage('Title is required'),
//     body('email').trim().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
//     body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters long'),
//     body('condition').trim().isIn(['New', 'Like New', 'Very Good', 'Good', 'Acceptable']).withMessage('Invalid condition specified'),
//     body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
//     body('details').escape(),
//     body('amount').isFloat({ gt: 0 }).withMessage('Offer must be a number greater than 0')
// ];

// exports.validateNewItem = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log("Validation errors:", errors.array());
//         return res.status(400).render('form', {
//             errors: errors.array(),
//             data: req.body,
//         });
//     }
//     next();
// };