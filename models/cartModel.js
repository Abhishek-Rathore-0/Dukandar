const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },
    ProductID: {
        type: String, 
        required: true
    },
    Quantity: {
        type: Number,
        min:0,
        max:9
        
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;