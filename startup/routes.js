const express = require('express');
//const errorHandler = require('../middleware/error-middleware');
//const notfound = require('../middleware/notfound-middleware');



module.exports = function (app){

    //app.use('/', hanlder);
    app.use(express.json());
    app.get('/',(req, res, next)=>{
        res.send('<h1> Hello World!</h1>');
    });

    //app.use(notfound);
    //app.use(errorHandler);
}