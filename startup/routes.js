const express = require('express');
const errorHandler = require('../middlewares/error-middleware');
const userRouter = require('../routes/user-router');

const sendMail = require('../utils/mail');
//const notfound = require('../middleware/notfound-middleware');



module.exports = function (app){

    //app.use('/', hanlder);
    app.use(express.json());
    app.get('/',(req, res, next)=>{
        res.send('<h1> Hello World!</h1>');
    });

    app.use('/user', userRouter);
    //app.use(notfound);
    app.use(errorHandler);
}