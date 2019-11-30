//
//
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstName: String,                   // required
    lastName: String,                    // required
    password:String,                      // required
    email: {
        type:String, 
        index:{unique: true}
    },          
    address: {  
        county: String,
        city: String
    },
    role: String,
    isVerified: Boolean
    
});

// hashing the password
userSchema.methods.setPassword = function (password){
    this.password = bcrypt.hash(password, config.get('bcrypt.saltRounds'));
}

// verifyning password
userSchema.methods.verifyPassword = function(password){
    return bcrypt.compare(password, this.password);
}

// generating tokens
userSchema.methods.generateToken = function(){

    const data = {
        id: this._id,
        role: this.role
    }

    return jwt.sign(
        data,
        config.get('jwt.secret'),
       {  expiresIn: config.get('jwt.expiresIn')}
    )
}
// verifying tokens
userSchema.statics.verifyToken = function(token){
    try{
       const decoded =  jwt.verify(token, config.get('jwt.secret'));
       return decoded;
    }catch(err){
        //return err;
        return false;
    }
}

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;

// let user = new User({});
// user.setPassword(122554587552);
// user.save();

// Usre.verifyToken();
