const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should not be blank.']
    },
    shop:{
        type: String,
        required: [true, 'Shop Name should not be blank.']
    },
    category:{
        type:[String],
        required:[true]
    },
    email: {
        type: String,
        required: [true,'Please provide your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide valid email.']
    },
    password: {
        type: String,
        required: [true,'Please provide a password.'],
        minlength: 8,
        select: false
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    location:{
        type:String,
        required:[true]
    },
    city:{
        type:String
    },
    mobile:{
        type:String,
        required:[true]
    },
    passwordChangedAt: Date,
    available_in:{
        type:String,
        default:"9:00 AM"
    },
    available_out:{
        type:String,
        default:"6:00 PM"
    }
});

agentSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

agentSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

agentSchema.methods.correctPassword= async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

agentSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;