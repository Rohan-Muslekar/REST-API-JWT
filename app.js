const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postsRoute = require('./api/routes/posts');
const usersRoute = require('./api/routes/users');

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('connected',() => console.log('Database Connected Successfully'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine' , 'pug');
app.set('views', './api/views')

//Rendering Home page
app.use('/', (req,res) => {
    res.render('home');
});

//NOTE: Always use bodyParser before Routing 
app.use('/posts', postsRoute);
app.use('/users', usersRoute);

//CORS Error
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method == 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
        return res.status(200).json({});
    }
    next();
});
// Error Handling
app.use((req,res,next) => {
    const error = new Error();
    error.message = "404 Not Found"
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500).json({
        message: error.message,
        status: error.status
    });
});

module.exports = app;