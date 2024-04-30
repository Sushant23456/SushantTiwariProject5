const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: { type: String, required: true },
  seller: { type: String, required: true },
  condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'],
  },
  price: { 
      type: Number, 
      required: true,
      min: 0.01
  },
  details: { type: String, required: true },
  image: { type: String, required: true },
  totalOffers: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  highestOffer: {
      type: Number,
      default: 0
  },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }]
});

const Item = mongoose.model('Item', itemSchema);

async function add(newItem) {
  try {
    return await Item.create(newItem);
  } catch (error) {
    console.error('Error adding new item:', error);
    throw error;
  }
}

async function getItemById(id) {
  try {
    return await Item.findById(id);
  } catch (error) {
    console.error('Error finding item by ID:', error);
    throw error;
  }
}


// exports.updateById = async function(id, updatedData) {
//   try {
//     const item = await Item.findByIdAndUpdate(id, updatedData, { new: true });
//     return item != null;
//   } catch (error) {
//     console.error('Error updating item by ID:', error);
//     throw error;
//   }
// };

async function updateById(id, updatedData) {
  try {
      const item = await Item.findByIdAndUpdate(id, updatedData, { new: true });
      return item != null;
  } catch (error) {
      console.error('Error updating item by ID:', error);
      throw error;
  }
};
          

async function searchByQuery(query) {
  try {
      const items = await Item.find({
          $or: [
              { title: { $regex: query, $options: 'i' } },
              { details: { $regex: query, $options: 'i' } }
          ]
      });
      return items;
  } catch (error) {
      console.error('Error searching items by query:', error);
      throw error;
  }
}

async function deleteById(id) {
  try {
      const result = await Item.findByIdAndDelete(id);
      return result;
  } catch (error) {
      console.error('Error deleting item by ID:', error);
      throw error;
  }
}


async function findBySeller(sellerName) {
  try {
    // Populate the 'offers' field when fetching items
    return await Item.find({ seller: sellerName }).populate('offers');
  } catch (error) {
    console.error('Error finding items by seller:', error);
    throw error;
  }
}


async function getAll() {
  try {
    return await Item.find({});
  } catch (error) {
    console.error('Error getting all items:', error);
    throw error;
  }
}

module.exports = {
  Item,
  getItemById,
  getAll,
  findBySeller,
  add,
  deleteById,
  updateById,
  searchByQuery
};
