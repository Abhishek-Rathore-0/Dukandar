const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should not be blank.']
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;