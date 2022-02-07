const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi-oid');
// const { mainModule } = require('process');
// const { boolean } = require('webidl-conversions');
// const { User, userSchema } = require('./user.js');

const todoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim:true
    },
    // user:{
    //     type: userSchema,
    //     required: true
    // },
    user:{
         type: Schema.Types.ObjectId, ref: 'User'
    },
    description:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim:true
    },
    done: {
        type:Boolean,
        default:false
    }
});

const TodoList = mongoose.model('TodoList', todoSchema);

function validateTodo(todo){
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        userId: Joi.objectId().required(),
        description: Joi.string().min(1).max(100).required(),
        done: Joi.boolean()
    });
    return schema.validate(todo);
}

exports.validate = validateTodo;
exports.TodoList = TodoList;