const Offer = require('../models/offerModel');
const { Item } = require('../models/itemsModel');

exports.makeOffer = async (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.session.user.id;
    const offerAmount = parseFloat(req.body.amount);

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        if (!item.active) {
            return res.status(400).render('error', { message: 'This item is no longer active' });
        }
        if (item.seller.toString() === userId.toString()) {
            return res.status(401).render('error', { message: 'You cannot make an offer on your own item' });
        }

        const newOffer = await Offer.create({
            amount: offerAmount,
            item: itemId,
            user: userId
        });
        console.log("New offer created successfully:", newOffer);

        item.offers.push(newOffer._id); 
        item.totalOffers += 1;
        item.highestOffer = Math.max(item.highestOffer, offerAmount);
        await item.save();

        req.flash('success', 'Offer made successfully!');
        res.redirect(`/items/${itemId}`);
    } catch (error) {
        console.error('Error making offer:', error);
        res.status(500).render('error', { message: 'Error making offer' });
    }
};


exports.viewOffers = async (req, res) => {
    const itemId = req.params.itemId;

    try {
        const item = await Item.findById(itemId).populate({
            path: 'offers',
            populate: { path: 'user' }
        });
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }

        res.render('itemOffers/offers', { item, offers: item.offers });
    } catch (error) {
        console.error('Error viewing offers:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};


exports.acceptOffer = async (req, res) => {
    const offerId = req.params.offerId;
    try {
        const offer = await Offer.findById(offerId).populate('item');
        if (!offer) {
            return res.status(404).render('error', { message: 'Offer not found' });
        }

        console.log("Offer:", offer);
        if (!offer.item) {
            console.log("No item associated with this offer");
            return res.status(404).render('error', { message: 'Associated item not found for the offer' });
        }

        if (offer.status === 'accepted') {
            return res.status(409).render('error', { message: 'This offer has already been accepted' });
        }

        offer.status = 'accepted';
        await offer.save();

        await Offer.updateMany(
            { item: offer.item._id, _id: { $ne: offer._id } },
            { status: 'rejected' }
        );

        offer.item.active = false;
        await offer.item.save();

        req.flash('success', 'Accepted successfully!');
        res.redirect(`/items/${offer.item._id}/offers`);
    } catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};












