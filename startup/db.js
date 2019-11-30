
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    /*data base connection logic */
    mongoose.connect(config.get('mongodb.host'), config.get('mongodb.settings')).then(()=>{
        console.log('database connected');
    }).
    catch(err=>{
        console.log('cannot connect to db');
    });
}
