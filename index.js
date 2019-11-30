const express = require('express');

// you should create DEBUG environmental variable
// and give it the value of a namespace given to
// the debug function
const debug = require('debug')('app:run');
const app = express();
const port = process.env.PORT || 3000;


/* if environmental variabes required are not set
    exit the process
*/
//app.get('env') returns process.env.NODE_ENV
// if undefined it returns development

require('./startup/logging')();    // logging startup fail errors
require('./startup/db')();         // connect to db
require('./startup/validation')(); // sets joi config
require('./startup/routes')(app);  // sets app routes

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
