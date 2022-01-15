const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const agentSchema = new mongoose.Schema({
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
    },
    photo: {
        type: String,
        default: 'default.jpg'
    }, 
    passwordChangedAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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
  
// userSchema.methods.createPasswordResetToken = function() {
//     const resetToken = crypto.randomBytes(32).toString('hex');
  
//     this.passwordResetToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');
  
//     // console.log({ resetToken }, this.passwordResetToken);
  
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
//     return resetToken;
// };

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;