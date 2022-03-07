const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },
    ProductID: {
        type: String, 
        required: true
    },
    ShopID: {
        type: String, 
        required: true
    },
    Quantity: {
        type: Number,
        enum: [1,2,3,4,5,6,7,8,9,0]
    },
    OrderDate: {
        type: Date,
        required: true
    },
    TransactionID: {
        type: String,
        required: true
    },
    PaymentMode: {
        type: String,
        enum: ['card','upi','cod','--']
    },
    Price:{
        type: String,
        required: true
    },
    Total: {
        type: String,
        required: true
    },
    Status: {
       type: String,
       enum: ['pending','success']
    },
    Delivered:{
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;