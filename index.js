const config = require('config');
const todoList = require('./routes/todos');
const auth = require('./routes/auth');
const users = require('./routes/users');
const mongoose = require('mongoose');
let express = require('express');
let app = express();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/todo')
    .then( () => console.log('connected to mongodb....'))
    .catch( err => console.error('could not connect to mongodb', err));


app.use(express.json());
app.use('/users', users);
app.use('/todoList', todoList);
app.use('/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to ${port} ...`));