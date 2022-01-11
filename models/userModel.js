const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should not be blank.']
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
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword= async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;