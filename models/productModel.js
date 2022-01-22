const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should not be blank.']
    },
    category:{
        type:String,
        required: [true, 'Category should not be blank.']
    },
    description:{
        type:String,
        required: [true, 'Description should not be blank.']
    },
    images:{
        type:[String]
    },
    price:{
        type:Number,
        required: [true, 'Price should not be given.']
    },
    quantity:{
        type:Number
    },
    shopId:{
        type:String
    }

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;