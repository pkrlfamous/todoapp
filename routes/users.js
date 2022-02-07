const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    console.log('user',user);
    res.send(user);
});

router.post('/', async (req, res) => {
const { error } = validate(req.body);
if(error) return res.status(400).send(error.details[0].message);

let user = await User.findOne({email: req.body.email});
if(user) return res.status(400).send('user already registered');

user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
});

const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt);
await user.save();

// res.send({'id':user._id, 'name':user.name, 'email':user.email});
// const token = jwt.sign({_id:user._id}, config.get("jwtPrivateKey"));
const token = user.generateAuthToken();
res.header('x-auth-token', token).send(_.pick(user, ['id','name','email']));
});

module.exports = router;