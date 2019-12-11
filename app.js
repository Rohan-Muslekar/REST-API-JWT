const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postsRoute = require('./api/routes/posts');

mongoose.connect(`mongodb+srv://rohan:${process.env.DB_PWD}@mongodbcluster-idi7v.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('connected',() => console.log('Database Connected Successfully'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//NOTE: Always use bodyParser before Routing 
app.use('/posts', postsRoute);


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