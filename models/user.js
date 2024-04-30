const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, 
        index: true 
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});


module.exports = mongoose.model('User', userSchema);

