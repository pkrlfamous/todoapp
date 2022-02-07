const auth = require('../middleware/auth');
const {TodoList, validate} = require('../models/todo');
const {User} = require('../models/user');
const express = require('express');
const { join } = require('lodash');
const router = express.Router();

router.get('/', async (req, res) => {
    const todoList = await TodoList.find().populate("user");
    res.send(todoList);
});

router.get('/:id', async(req, res) => {
    const todoList = await TodoList.findById(req.params.id);
    if(!todoList) return res.status(400).send('todo not found');
    res.send(todoList);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(400).send('invalid user id');

    let todoList = new TodoList({
        name: req.body.name,
        // user: {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     password: user.password
        // },
        user: req.body.userId,
        description: req.body.description,
        done: req.body.done
    },{__v:0});
    await todoList.save();
    res.send(todoList);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).send('todolist not found');

    const todoList = await TodoList.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            user: req.body.userId,
            description: req.body.description,
            done: req.body.done
        }, {new: true});

    if(!todoList) return res.status(404).send('todoList not found');
    res.send(todoList);
});



// router.patch('/:id', async (req, res) => {
//     const {error} = validate(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     const user = await User.findById(req.body.userId);
//     if(!user) return res.status(404).send('todo list not found');

//     const todoList = await TodoList.findByIdAndUpdate(req.params.id,
//        req.body, {new: true});

//     if(!todoList) return res.status(404).send('todo list not found');
//     res.send(todoList);
// });



router.delete('/:id', auth, async (req, res) => {
    const todoList = await TodoList.findByIdAndRemove(req.params.id);
    if(!todoList) return res.status(400).send('todolist not found');
    res.send(todoList);
})

module.exports = router;