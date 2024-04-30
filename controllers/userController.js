const User = require('../models/user');
const itemsModel = require('../models/itemsModel');
const Offer = require('../models/offerModel');
const bcrypt = require('bcrypt');


exports.showLogin = (req, res) => {
    res.render('users/login', {
        sessionData: req.session
    });
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Both email and password are required!');
        return res.redirect('/users/login');
    }

    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash('error', 'No Account with that email! Please sign up.');
            req.session.save(() => {
                res.redirect('/users/login');
            });
            return;
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords', err);
                return next(err);
            }
            if (!isMatch) {
                req.flash('error', 'Invalid password!');
                req.session.save(() => {
                    res.redirect('/users/login');
                });
                return;
            }
            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            req.flash('success', 'You have successfully logged in!');
            return res.redirect('/users/profile');
        });
    }).catch(err => {
        console.error('Error finding user', err);
        next(err);
    });
};


exports.showNew = (req, res) => {
    res.render('users/new');
};


exports.new = async (req, res) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/users/login');
    } catch (error) {
        if (error.code === 11000) {
            req.flash('error', 'Email already in use. Please use a different email.');
            res.redirect('/users/new');
        } else {
            console.error('Signup error:', error);
            res.render('users/new', { errorMessage: 'Error signing up: ' + error.message });
        }
    }
};


exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.status(404).redirect('/users/login');
        }

        const fullName = `${user.firstName} ${user.lastName}`;
        const items = await itemsModel.findBySeller(fullName);
        const offers = await Offer.find({ user: user._id }).populate('item');

        res.render('users/profile', {
            user: user,
            items: items,
            offers: offers 
        });

    } catch (error) {
        console.error('Profile error:', error);
        req.flash('error', 'Internal Server Error');
        res.status(500).redirect('/users/login');
    }
};



exports.logout = (req, res) => {
    req.flash('success', 'You have successfully logged out.');
    req.session.destroy(err => {
        if (err) {
            console.error('Failed to end the session during logout.', err);
            return res.redirect('/users/profile');
        } else {
            res.redirect('/users/login');
        }
    });
};






