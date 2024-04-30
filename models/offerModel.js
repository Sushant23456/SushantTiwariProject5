const mongoose = require('mongoose');
const { Schema } = mongoose;

const offerSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],
        default: 'pending'
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
