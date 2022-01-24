const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should not be blank.'],
        unique: true
        
    },
    slug: String,
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

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {  
    this.slug = slugify(this.name, { lower: true });
    next();
});
  
const Product = mongoose.model('Product', productSchema);
module.exports = Product;