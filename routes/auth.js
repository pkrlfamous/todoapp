const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router()

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send('validation error');

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('invalid email');

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('invalid password');

    const token = user.generateAuthToken();
    // const token = jwt.sign({_id:user._id}, config.get("jwtPrivateKey"));
    res.send(token);
});

function validate(user){
    const schema = Joi.object({
        email: Joi.string().min(1).max(100).required().email(),
        password: Joi.string().min(1).max(100).required()
    });
    return schema.validate(user);
}

module.exports = router;