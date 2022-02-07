const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
// const { mainModule } = require('process');
// const { boolean } = require('webidl-conversions');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength:100,
        required:true
    },
    password:{
        type: String,
        maxlength:100,
        minlength:1,
        required: true,
        trim: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        email: Joi.string().min(1).max(100).required().email(),
        password: Joi.string().min(1).max(100).required()
    });
    return schema.validate(user);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;